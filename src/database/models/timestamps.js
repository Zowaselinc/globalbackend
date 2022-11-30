const generateTimestamps = (Sequelize, mode) => {
    return {
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal(
                mode == 1 ? 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' : "CURRENT_TIMESTAMP"
            ),
        },
    }
}

module.exports = generateTimestamps;