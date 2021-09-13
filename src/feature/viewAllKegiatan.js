const { testQuery } = require("../../db/connection")

const viewAllKegiatan = async (req, res) => {
    const query = 'SELECT * FROM kegiatan'
    let successMessage = ''

    try {
        const { rows } = await testQuery(query)

        rows.forEach((data) => {
            successMessage += `
            <li>
                Nama Kegiatan: ${data.nama_kegiatan}<br>
                Tanggal Pelaksanaan: ${String(data.tanggal_pelaksanaan).slice(0, 25)}<br>
                Tanggal Berakhir: ${String(data.tanggal_berakhir).slice(0, 25)}<br>
                Kode Absen: ${data.kegiatan_id ? data.kegiatan_id: '-'}<br><br>
            </li>
            `
        })

        res.status(200).render('viewAllKegiatan', {
            data: `
            <div style="width: 40%; margin: auto; margin-top: 2%; padding: 10px;">
                <ol style="text-align: justify; font-size: 16px;">
                    ${successMessage}
                </ol>
            </div>
            `
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = { viewAllKegiatan }