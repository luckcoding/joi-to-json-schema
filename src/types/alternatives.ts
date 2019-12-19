export const alternatives = (convert, schema, joi, transformer) => {
    const result = (schema.oneOf = [])

    joi._inner.matches.forEach(function(match) {
        if (match.schema) {
            return result.push(convert(match.schema, transformer))
        }

        if (!match.is) {
            throw new Error('joi.when requires an "is"')
        }
        if (!(match.then || match.otherwise)) {
            throw new Error(
                'joi.when requires one or both of "then" and "otherwise"'
            )
        }

        if (match.then) {
            result.push(convert(match.then, transformer))
        }

        if (match.otherwise) {
            result.push(convert(match.otherwise, transformer))
        }
    })

    return schema
}
