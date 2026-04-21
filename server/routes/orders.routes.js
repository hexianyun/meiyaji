import { Prisma } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { verifyMember } from '../middleware/auth.js'

const router = Router()

const orderItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
  artist: z.string().min(1),
  img: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  qty: z.coerce.number().int().min(1).default(1),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, '订单中至少需要一件作品'),
  buyerName: z.string().min(1).optional(),
  buyerPhone: z.string().min(1).optional(),
  shippingAddress: z.string().min(1).optional(),
})

function formatOrderStatus(status) {
  switch (status) {
    case 'pending_payment': return '待付款'
    case 'pending_shipment': return '待发货'
    case 'in_transit': return '运输中'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return status
  }
}

function serializeOrder(order) {
  const items = Array.isArray(order.items) ? order.items : []

  return {
    id: order.id,
    orderNo: order.orderNo,
    status: formatOrderStatus(order.status),
    statusCode: order.status,
    total: Number(order.totalAmount),
    date: order.createdAt,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    buyerPhone: order.buyerPhone,
    shippingAddress: order.shippingAddress,
    logisticsCompany: order.logisticsCompany,
    logisticsNumber: order.logisticsNumber,
    trackingNote: order.trackingNote,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    arts: items,
  }
}

function generateOrderNo() {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const timePart = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')
  const randomPart = Math.floor(Math.random() * 9000 + 1000)

  return `MYJ${datePart}${timePart}${randomPart}`
}

router.use(verifyMember)

router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({
      message: '获取订单成功。',
      orders: orders.map(serializeOrder),
    })
  } catch (error) {
    return res.status(500).json({
      message: '获取订单失败，请稍后再试。',
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body)
    const total = data.items.reduce((sum, item) => sum + (item.price * item.qty), 0)

    const order = await prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId: req.user.id,
        buyerName: data.buyerName || req.user.realName || req.user.username || req.user.email,
        buyerEmail: req.user.email,
        buyerPhone: data.buyerPhone,
        shippingAddress: data.shippingAddress || '待补充收货地址',
        status: 'pending_shipment',
        totalAmount: new Prisma.Decimal(total),
        items: data.items,
      },
    })

    return res.status(201).json({
      message: '订单创建成功。',
      order: serializeOrder(order),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '订单参数不合法。',
        errors: error.flatten(),
      })
    }

    return res.status(500).json({
      message: '创建订单失败，请稍后再试。',
    })
  }
})

export default router
