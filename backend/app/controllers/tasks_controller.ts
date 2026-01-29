import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator} from '#validators/task'

export default class TasksController {

    async index({ auth, request, response}: HttpContext) {
        const user = auth.user!
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)
        const status = request.input('status')

        const query = Task.query().where('userId', user.id).orderBy('createdAt', 'desc')

        if (status) {
            query.where('status', status)
        }

        const tasks = await query.paginate(page, limit)

        return response.ok({
            success: true,
            data: tasks.all(),
            meta: tasks.getMeta(),
        })
    }

    async store({ auth, request, response}: HttpContext) {
        const user = auth.user!
        const data = await request.validateUsing(createTaskValidator)

        const task = await Task.create({
            userId: user.id,
            title: data.title,
            description: data.description || null,
            status: data.status || 'pending',
        })

        return response.created({
            success: true,
            data: task,
            message: 'Task created successfully',
        })
    }

    async show({ auth, params, response }: HttpContext) {
        const user = auth.user!
        const task = await Task.find(params.id)

        if(!task) {
            return response.notFound({
                success: false,
                message: 'Task not found',
            })
        }

        if (task.userId !== user.id && !user.isAdmin()) {
            return response.forbidden({
                success: false,
                message: 'Access denied'
            })
        }

        return response.ok({
            success: true,
            data: task,
        })
    }

    async update({ auth, params, request, response }: HttpContext) {
        const user = auth.user!
        const task = await Task.find(params.id)

        if(!task) {
            return response.notFound({
                success: false,
                message: 'Task not found',
            })
        }

        if (task.userId !== user.id && !user.isAdmin()) {
            return response.forbidden({
                success: false,
                messages: 'Task not found',
            })
        }

        const data = await request.validateUsing(updateTaskValidator)
        task.merge(data)
        await task.save()

        return response.ok({
            success: true,
            data: task,
            message: 'Task updated successfully',
        })
    }

    async destroy({ auth, params, response }: HttpContext) {
        const user = auth.user!
        const task = await Task.find(params.id)

        if(!task) {
            return response.notFound({
                success: false,
                messages: 'Task not found',
            })
        }

        if (task.userId !== user.id && !user.isAdmin()) {
            return response.forbidden({
                success: false,
                message: 'Access denied'
            })
        }

        await task.delete()

        return response.ok({
            success: true,
            message: 'Task deleted successfully',
        })
    }
}