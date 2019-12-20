export const number = (_convert, schema, joi) => {
    schema.type = 'number'
    joi._rules.forEach(test => {
        switch (test.name) {
            case 'integer':
                schema.type = 'integer'
                break
            case 'less':
                schema.exclusiveMaximum = true
                schema.maximum = test.args.limit
                break
            case 'greater':
                schema.exclusiveMinimum = true
                schema.minimum = test.args.limit
                break
            case 'min':
                schema.minimum = test.args.limit
                break
            case 'max':
                schema.maximum = test.args.limit
                break
            case 'precision':
                let multipleOf
                if (test.args.limit > 1) {
                    multipleOf = JSON.parse(
                        '0.' + '0'.repeat(test.args.limit - 1) + '1'
                    )
                } else {
                    multipleOf = 1
                }
                schema.multipleOf = multipleOf
                break
        }
    })
    return schema
}
