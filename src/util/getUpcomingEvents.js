const { testQuery } = require('../../db/connection')

const getUpcomingEvents = async () => {
    const query = 'SELECT * FROM kegiatan'
    let upcomingEvents = []
    
    try {
        const { rows } = await testQuery(query)
        const now = new Date()
        
        rows.forEach((data) => {
            if (new Date(data.tanggal_berakhir) > now) {
                upcomingEvents.push(data)
            }
        })
        
        return upcomingEvents
    } catch (e) {
        console.log(e)
        return []
    }
}

module.exports = { getUpcomingEvents }