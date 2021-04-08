import * as Joi from 'joi'

export const object = (convert, schema, joi: Joi.Schema, transformer) => {
    schema.type = 'object'
    schema.properties = {}
    schema.additionalProperties = Boolean(
        joi._flags.allowUnknown || !joi.$_terms.keys
    )
    schema.patterns = []
    if (joi.$_terms.patterns) {
        schema.patterns = joi.$_terms.patterns.map(pattern => {
            return {
                regex: pattern.regex,
                rule: convert(pattern.schema, transformer)
            }
        })
    }
    if (!joi.$_terms.keys) {
        return schema
    }

    joi.$_terms.keys.forEach(property => {
        const flagPresence = property?.schema?._flags?.presence
        const prefPresence = property.schema?._preferences?.presence
        if (flagPresence !== 'forbidden') {
            schema.properties[property.key] = convert(
                property.schema,
                transformer
            )
            if (
                flagPresence === 'required' ||
                (prefPresence === 'required' && flagPresence !== 'optional')
            ) {
                schema.required = schema.required || []
                schema.required.push(property.key)
            }
        }
    })

    return schema
}
