export const array = (convert, schema, joi, transformer) => {
    schema.type = 'array'
    joi._tests.forEach(test => {
        switch (test.name) {
            case 'unique':
                schema.uniqueItems = true
                break
            case 'length':
                schema.minItems = schema.maxItems = test.arg
                break
            case 'min':
                schema.minItems = test.arg
                break
            case 'max':
                schema.maxItems = test.arg
                break
        }
    })

    if (joi._inner) {
        if (joi._inner.ordereds.length) {
            schema.ordered = joi._inner.ordereds.map(item =>
                convert(item, transformer)
            )
        }

        let list
        if (joi._inner.inclusions.length) {
            list = joi._inner.inclusions
        } else if (joi._inner.requireds.length) {
            list = joi._inner.requireds
        }

        if (list) {
            schema.items = convert(list[0], transformer)
        }
    }

    return schema
}
