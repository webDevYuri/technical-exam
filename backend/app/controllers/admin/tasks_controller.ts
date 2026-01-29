import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'

export default class AdminTasksController {

    async index({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)
        const status = request.input('status')
        const userId = request.input('userId')

        const query = Task.query().preload('user').orderBy('createdAt', 'desc')

        if (status) {
            query.where('status', status)
        }

        if (userId) {
            query.where('userId', userId)
        }

        const tasks = await query.paginate(page, limit)

        return response.ok({
            success: true,
            data: tasks.all().map((task) => ({
                id: task.id,
                userId: task.userId,
                title: task.title,
                description: task.description,
                status: task.status,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                user: {
                    id: task.user.id,
                    fullName: task.user.fullName,
                    email: task.user.email
                },
            })),
            meta: tasks.getMeta(),
        })
    }
}