export const number = (schema, joi) => {
    schema.type = 'number'
    joi._tests.forEach(test => {
        switch (test.name) {
            case 'integer':
                schema.type = 'integer'
                break
            case 'less':
                schema.exclusiveMaximum = true
                schema.maximum = test.arg
                break
            case 'greater':
                schema.exclusiveMinimum = true
                schema.minimum = test.arg
                break
            case 'min':
                schema.minimum = test.arg
                break
            case 'max':
                schema.maximum = test.arg
                break
            case 'precision':
                let multipleOf
                if (test.arg > 1) {
                    multipleOf = JSON.parse(
                        '0.' + '0'.repeat(test.arg - 1) + '1'
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
