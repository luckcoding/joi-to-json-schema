export const string = (_convert, schema, joi) => {
    schema.type = 'string'
    joi._rules.forEach(test => {
        switch (test.name) {
            case 'email':
                schema.format = 'email'
                break
            case 'pattern':
                const args = test.args
                const pattern = args && args.regex ? args.regex : args
                schema.pattern = String(pattern)
                    .replace(/^\//, '')
                    .replace(/\/$/, '')
                break
            case 'min':
                schema.minLength = test.args.limit
                break
            case 'max':
                schema.maxLength = test.args.limit
                break
            case 'length':
                schema.minLength = schema.maxLength = test.args.limit
                break
            case 'uri':
                schema.format = 'uri'
                break
        }
    })

    return schema
}
