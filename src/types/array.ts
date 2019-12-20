export const array = (convert, schema, joi, transformer) => {
    schema.type = 'array'
    joi._rules.forEach(test => {
        switch (test.name) {
            case 'unique':
                schema.uniqueItems = true
                break
            case 'length':
                schema.minItems = schema.maxItems = test.args.limit
                break
            case 'min':
                schema.minItems = test.args.limit
                break
            case 'max':
                schema.maxItems = test.args.limit
                break
        }
    })
    if (joi.$_terms) {
        if (joi.$_terms.ordered.length) {
            schema.ordered = joi.$_terms.ordered.map(item =>
                convert(item, transformer)
            )
        }

        let list
        if (joi.$_terms._inclusions.length) {
            list = joi.$_terms._inclusions
        } else if (joi.$_terms._requireds.length) {
            list = joi.$_terms._requireds
        }

        if (list) {
            schema.items = convert(list[0], transformer)
        }
    }

    return schema
}
