const buttonAbsentPengurus = document.getElementById('btnAbsenPengurus')

buttonAbsentPengurus.addEventListener('click', async () => {
    const formAbsenPengurus = document.forms['createAbsent']
    
    if (!validateAbsentPengurusData(formAbsenPengurus)) {
        alert('Mohon penuhi semua data terlebih dahulu')
        return
    }

    document.body.style.cursor = 'wait'
    buttonAbsentPengurus.style.cursor = 'wait'
    
    const payload = {
        lingkup: formAbsenPengurus.lingkup.value,
        namaKegiatan: formAbsenPengurus.namaKegiatan.value,
        tanggalPelaksanaan: formAbsenPengurus.tanggalPelaksanaan.value,
        jamPelaksanaan: formAbsenPengurus.jamPelaksanaan.value,
        tanggalBerakhir: formAbsenPengurus.tanggalBerakhir.value,
        jamBerakhir: formAbsenPengurus.jamBerakhir.value
    }

    const targetEndpoint = 'http://localhost:3000/feature/feature001'
    try {
        const response = await postData(payload, targetEndpoint)
        
        alert(response.errorMessage || response.successMessage)
        document.body.style.cursor = 'default'
        buttonAbsentPengurus.style.cursor = 'default'
    } catch (e) {
        alert('failed to post request.')
    }
})

const validateAbsentPengurusData = (object) => {
    const dataList = [
        'lingkup',
        'namaKegiatan',
        'tanggalPelaksanaan',
        'jamPelaksanaan',
        'tanggalBerakhir',
        'jamBerakhir'
    ]

    if (checkIfDataIsNull(dataList, object)) return false

    return true
}

const checkIfDataIsNull = (dataList, object) => {
    for (let atributName in dataList) {
        const value = String(object[atributName].value).trim()

        if ( value === null || value === '') return true
    }

    return false
}

const postData = async (payload, targetEndpoint) => {
    try {
        const response = await fetch (targetEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        return await response.json()
    } catch (e) {
        console.log(e)
        return { errorMessage: 'Network Error. Please check your connection'}
    }
}