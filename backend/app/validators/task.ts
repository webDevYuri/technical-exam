import vine from "@vinejs/vine";

export const createTaskValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(1).maxLength(255),
        description: vine.string().maxLength(1000).optional(),
        status: vine.enum(['pending', 'completed']).optional()
    })
)

export const updateTaskValidator = vine.compile(
        vine.object({
        title: vine.string().minLength(1).maxLength(255).optional(),
        description: vine.string().maxLength(1000).optional(),
        status: vine.enum(['pending', 'completed']).optional()
    })
)