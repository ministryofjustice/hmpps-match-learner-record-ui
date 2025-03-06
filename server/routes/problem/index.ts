import { Router } from 'express'
import ThereIsAProblemController from './thereIsAProblem'

export default function thereIsAProblemRoutes(router: Router) {
  const thereIsAProblemController = new ThereIsAProblemController()
  router.get('/there-is-a-problem', thereIsAProblemController.getThereIsAProblem)
}
