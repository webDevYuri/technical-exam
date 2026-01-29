/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const TasksController = () => import('#controllers/tasks_controller')
const AdminTasksController = () => import('#controllers/admin/tasks_controller')
const AdminUsersController = () => import('#controllers/admin/users_controller')

router.get('/', async () => {
  return { status: 'ok', message: 'To-Do API is running' }
})

router
.group(() => {
  router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

  router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
  })
  .prefix('/auth')
  .use(middleware.auth())

  router
  .group(() => {
    router.get('/', [TasksController, 'index'])
    router.post('/', [TasksController, 'store'])
    router.get('/:id', [TasksController, 'show'])
    router.put('/:id', [TasksController, 'update'])
    router.delete('/:id', [TasksController, 'destroy'])
  })
  .prefix('/tasks')
  .use(middleware.auth())

  router
  .group(() => {
    router.get('/tasks', [AdminTasksController, 'index'])
    router.get('/users', [AdminUsersController, 'index'])
    router.post('/users', [AdminUsersController, 'store'])
    router.get('/users/:id', [AdminUsersController, 'show'])
    router.put('/users/:id', [AdminUsersController, 'update'])
    router.delete('/users/:id', [AdminUsersController, 'destroy'])
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])
})
.prefix('/api')