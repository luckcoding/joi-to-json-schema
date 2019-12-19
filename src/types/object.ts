import * as Joi from '@hapi/joi'

export const object = (convert, schema, joi: Joi.Schema, transformer) => {
    schema.type = 'object'
    schema.properties = {}
    console.log(joi)
    schema.additionalProperties = Boolean(
        joi._flags.allowUnknown || !joi.$_terms.keys
    )
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
        if (property.schema._flags.presence !== 'forbidden') {
            schema.properties[property.key] = convert(
                property.schema,
                transformer
            )
            if (
                property.schema._flags.presence === 'required' ||
                (property.schema._settings &&
                    property.schema._settings.presence === 'required' &&
                    property.schema._flags.presence !== 'optional')
            ) {
                schema.required = schema.required || []
                schema.required.push(property.key)
            }
        }
    })

    return schema
}
