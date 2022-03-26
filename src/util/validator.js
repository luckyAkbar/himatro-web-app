const comparator = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const timeFormatComparator = /[!@#$%^&*:()_+\=\[\]{};'"\\|,<>\/?]+/;
const waktuComparator = /[!@#$%^&*()_+\-=\[\]{};'"\\|,.<>\/?]+/;
const keteranganComparator = /[h,i]/;
const namaComparator = /[!@#$%^&*()_+\-=\[\]{};:"\\|,<>\/?]+/;
const sortByComparator = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
const emailComparator = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
const letterComparator = /[a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z]/;
const commonTextComparator = /[!@#$%^&*()_+\=\[\]{};'"\\|<>\/?]+/; /* allowing: -,.: */

const commonValidator = (variable) => {
  try {
    if (comparator.test(variable)) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

const commonTextValidator = (text) => {
  try {
    if (text.length > 256) return false;
    if (commonTextComparator.test(text)) return false;
    return true;
  } catch (e) {
    return false;
  }
};

const commonNumberValidator = (number) => {
  const stringNumber = String(number).toLocaleLowerCase();

  try {
    if (comparator.test(number)) {
      return false;
    }

    if (Number.isNaN(number)) {
      return false;
    }

    if (letterComparator.test(stringNumber)) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

const npmValidator = (npm) => {
  try {
    if (npm.length > 10) {
      return false;
    }

    const test = parseInt(npm, 10);

    if (Number.isNaN(test)) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const sortByValidator = (sortBy) => {
  try {
    if (sortByComparator.test(sortBy)) {
      return false;
    }

    if (sortBy !== 'divisi' || sortBy !== 'keterangan' || sortBy !== 'waktu_pengisian') {
      return 'divisi';
    }
  } catch (e) {
    return false;
  }

  return true;
};

const showValueValidator = (show) => {
  try {
    if (comparator.test(show)) {
      return false;
    }

    if (Number.isNaN(show)) {
      return 'all';
    }
  } catch (e) {
    return false;
  }

  return 'all';
};

const namaValidator = (nama) => {
  try {
    if (namaComparator.test(nama)) return false;
    if (nama.length > 255) return false;
    if (nama.trim() === '') return false;

    return true;
  } catch (e) {
    return false;
  }
};

const namaKegiatanValidator = (namaKegiatan) => {
  try {
    if (namaKegiatan.trim() === '') return false;
    if (comparator.test(namaKegiatan)) return false;
    if (namaKegiatan.length > 255) return false;

    return true;
  } catch (e) {
    return false;
  }
};

const tanggalValidator = (tanggal) => {
  try {
    if (timeFormatComparator.test(tanggal)) return false;
    if (tanggal.length > 10) return false;

    const testDate = new Date(tanggal);
    if (testDate.toString() === 'Invalid Date') return false;

    return true;
  } catch (e) {
    return false;
  }
};

const waktuValidator = (waktu) => {
  try {
    if (waktu.length > 8) return false;
    if (timeFormatComparator.test(waktu)) return false;
    if (letterComparator.test(waktu.toLowerCase())) return false;
    if (waktuComparator.test(waktu)) return false;

    const timeComponent = waktu.split(':');

    if (Number(timeComponent[0]) > 24) return false;
    if (Number(timeComponent[1]) > 60 || Number(timeComponent[2]) > 60) return false;

    return true;
  } catch (e) {
    return false;
  }
};

const keteranganValidator = (keterangan) => {
  try {
    if (keterangan.length !== 1) {
      return false;
    }

    if (comparator.test(keterangan)) {
      return false;
    }

    if (keterangan.search(keteranganComparator) !== 0) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const refIdValidator = (refId) => {
  try {
    if (refId.length !== 10) {
      return false;
    }

    if (comparator.test(refId)) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const emailValidator = (email) => {
  try {
    const emailParts = email.split('@');
    const serverEmail = emailParts[1].split('.');

    if (emailParts[0].length > 105 || emailParts[1].length > 105) {
      return false;
    }

    if (emailParts[0].length === 0 || emailParts[1].length === 1) {
      return false;
    }

    if (serverEmail[0].length === 0 || serverEmail[1].length === 0) {
      return false;
    }

    if (!(/[.]/.test(emailParts[1]))) {
      return false;
    }

    if (!(/@/.test(email))) {
      return false;
    }

    if (emailComparator.test(email)) {
      return false;
    }

    if (!letterComparator.test(email)) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const modeValidator = (mode) => {
  try {
    if (comparator.test(mode)) {
      return false;
    }

    if (!(mode === 'view' || mode === 'input' || mode === 'post' || mode === 'create')) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const prodiValidator = (prodi) => {
  try {
    if (prodi !== 'Teknik Informatika' && prodi !== 'Teknik Elektro') {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

const departemenValidator = (departemen) => {
  try {
    switch (departemen) {
      case 'Pengurus Harian':
        return true;
      case 'Pendidikan dan Pengembangan Diri':
        return true;
      case 'Kaderisasi dan Pengembangan Organisasi':
        return true;
      case 'Sosial dan Kewirausahaan':
        return true;
      case 'Komunikasi dan Informasi':
        return true;
      case 'Pengembangan Keteknikan':
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

const divisiValidator = (divisi) => {
  try {
    switch (divisi) {
      case 'Pimpinan (kadep / kadiv / sekdep)':
        return true;
      case 'Pengurus Harian':
        return true;
      case 'Minat dan Bakat':
        return true;
      case 'Pendidikan':
        return true;
      case 'Kerohanian':
        return true;
      case 'Kaderisasi dan Pengembangan Organisasi':
        return true;
      case 'Sosial':
        return true;
      case 'Kewirausahaan':
        return true;
      case 'Media Informasi':
        return true;
      case 'Hubungan Masyarakat':
        return true;
      case 'Penelitian dan Pengembangan':
        return true;
      case 'Pengabdian Masyarakat':
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

const jabatanValidator = (jabatan) => {
  try {
    switch (jabatan) {
      case 'Ketua':
        return true;
      case 'Wakil Ketua':
        return true;
      case 'Sekertaris Umum':
        return true;
      case 'Wakil Sekertaris Umum':
        return true;
      case 'Bendahara':
        return true;
      case 'Wakil Bendahara':
        return true;
      case 'Kepala Departemen':
        return true;
      case 'Sekertaris Departemen':
        return true;
      case 'Kepala Divisi':
        return true;
      case 'Anggota':
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

const tanggalLahirValidator = (tanggalLahir) => {
  try {
    if (tanggalLahir.length > 10) {
      return false;
    }

    if (timeFormatComparator.test(tanggalLahir)) {
      return false;
    }

    if (!/-/g.test(tanggalLahir)) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

const golonganDarahValidator = (golonganDarah) => {
  try {
    switch (golonganDarah) {
      case 'A':
        return true;
      case 'B':
        return true;
      case 'AB':
        return true;
      case 'O':
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

const jalurMasukValidator = (jalurMasuk) => {
  try {
    switch (jalurMasuk) {
      case 'SBMPTN':
        return true;
      case 'SNMPTN':
        return true;
      case 'Mandiri':
        return true;
      case 'Prestasi':
        return true;
      case 'Lainnya':
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

const ipkValidator = (ipk) => {
  const IPK = Number(ipk);
  try {
    if (IPK <= 0 || IPK > 4) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

const lingkupValidator = (lingkup) => {
  try {
    switch (lingkup) {
      case 'seluruhAnggota':
        return true;
      case 'kpo':
        return true;
      case 'ppd':
        return true;
      case 'soswir':
        return true;
      case 'kominfo':
        return true;
      case 'bangtek':
        return true;
      case 'ph':
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

const multipleCommonTextValidator = (textArray) => {
  let returnValue = true;
  try {
    textArray.forEach((text) => {
      if (!commonTextValidator(text)) {
        returnValue = false;
      }
    });

    return returnValue;
  } catch (e) {
    return false;
  }
};

const multipleCommonNumberValidator = (numberArray) => {
  let returnValue = true;
  try {
    numberArray.forEach((number) => {
      if (!commonNumberValidator(number)) {
        returnValue = false;
      }
    });

    return returnValue;
  } catch (e) {
    return false;
  }
};

const validateAbsentRefData = (data) => {
  const {
    namaKegiatan,
    tanggalPelaksanaan,
    jamPelaksanaan = '00:00:00',
    tanggalBerakhir,
    jamBerakhir = '23:59:59',
    lingkup,
  } = data;

  try {
    if (!namaKegiatanValidator(namaKegiatan)) return false;
    if (!tanggalValidator(tanggalPelaksanaan)) return false;
    if (!tanggalValidator(tanggalBerakhir)) return false;
    if (waktuValidator(jamPelaksanaan) && waktuValidator(jamBerakhir)) return false;
    if (!lingkupValidator(lingkup)) return false;

    return true;
  } catch (e) {
    return false;
  }
};

const postAbsentDataValidator = (data) => {
  const {
    absentId,
    npm,
    nama,
    keterangan,
  } = data;

  try {
    if (
      !(
        npmValidator(npm)
        && namaValidator(nama)
        && keteranganValidator(keterangan)
        && refIdValidator(absentId)
      )
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

module.exports = {
  commonValidator,
  commonTextValidator,
  commonNumberValidator,
  npmValidator,
  namaValidator,
  namaKegiatanValidator,
  tanggalValidator,
  validateAbsentRefData,
  refIdValidator,
  modeValidator,
  sortByValidator,
  showValueValidator,
  postAbsentDataValidator,
  emailValidator,
  prodiValidator,
  departemenValidator,
  divisiValidator,
  jabatanValidator,
  tanggalLahirValidator,
  golonganDarahValidator,
  jalurMasukValidator,
  ipkValidator,
  multipleCommonTextValidator,
  multipleCommonNumberValidator,
};
