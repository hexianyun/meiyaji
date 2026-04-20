import app from './app.js'
import { config } from './config.js'

app.listen(config.port, () => {
  console.log(`Meiyaji auth server running at http://localhost:${config.port}`)
})
