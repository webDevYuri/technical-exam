import vine from "@vinejs/vine"

export const createUserValidator = vine.compile(
    vine.object({
        fullname: vine.string().minLength(1).maxLength(255).optional(),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        role: vine.enum(['admin', 'regular'])
    })
)

export const updateUserValidator = vine.compile(
        vine.object({
        fullname: vine.string().minLength(1).maxLength(255).nullable().optional(),
        email: vine.string().email().optional(),
        password: vine.string().minLength(6).optional(),
        role: vine.enum(['admin', 'regular']).optional()
    })
)