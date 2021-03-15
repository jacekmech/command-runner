const checkRequiredOptions = (optionsSpec, options) => {
    for (const spec of optionsSpec) {
        if (spec.required && !options[spec.name]) {
            const error = new Error('Required value not specified');
            error.name = 'OPTION_NOT_SPECIFIED';
            error.optionName = spec.name;
            throw error;
        }
    }
};

module.exports = checkRequiredOptions;
