const { load } = require('csv-load-sync');
const fs = require('fs');

const readDataCsv = (filePath) => {
  const result = [];

  const csv = load(filePath);

  csv.forEach((chunks) => {
    const {
      nama1, npm1, nama2, npm2,
    } = chunks;
    let dataObject = {};

    if (nama1) {
      dataObject = {
        nama: nama1,
        npm: npm1,
      };
      result.push(dataObject);
    }

    if (nama2) {
      dataObject = {
        nama: nama2,
        npm: npm2,
      };
      result.push(dataObject);
    }
  });

  return result;
};

/*
const namaDepartemen = 'Departemen Pendidikan dan Pengembangan Diri'
const namaDivisi = 'Pendidikan'
const dataNpmDepartemen = load(__dirname+'/fullData.csv')

const dataNpmSeluruhHima = readDataCsv(__dirname+'/test.csv')
let i = 0

dataNpmSeluruhHima.forEach(({ npm }) => {
  dataNpmDepartemen.forEach((data) => {
    if (npm === data.npm) {
      i +=1
    }
  });

  if (i === 0) {
    console.log(npm);
  }

  i = 0
})
*/

// console.log(dataNpmSeluruhHima[0].nama);

// let completeData = []

/*
dataNpmDepartemen.forEach((data) => {
  //console.log(data.npm);

  dataNpmSeluruhHima.forEach((item) => {
    if (data.npm === item.npm) {
      completeData.push(`${item.npm},${item.nama},${namaDepartemen},${namaDivisi}\n`)
    }
  });

})
*/
// console.log(completeData);
/*
completeData.forEach((data) => {
  fs.writeFileSync(__dirname+'/fullData.csv', data, { flag: 'a' })
});
*/

/*
const getLinesOfdata = ({ namaDepartemen, namaDivisi }, dataNpmDepartemen, dataNpmSeluruhHima) => {
  let linesOfData = []
  const getNama = (dataNpmDepartemen, dataNpmSeluruhHima) => {
    dataNpmDepartemen.forEach((data) => {
      for (let i = 0; i < dataNpmSeluruhHima.length; i++) {
        if (data.npm === dataNpmSeluruhHima[i].npm) {
          linesOfData.push(`${npm},${dataNpmSeluruhHima[i].nama},${namaDepartemen},${namaDivisi}`)
        }
      }
    })
  }

  return linesOfData
}

const data = getLinesOfdata({ namaDepartemen, namaDivisi }, dataNpmDepartemen, dataNpmSeluruhHima)
console.log(data);
*/
const readDataMaba = (filePath, kelas) => {
  const result = [];
  let content = [];

  const csv = load(filePath);
  readDataCsv();

  csv.forEach((data) => {
    content = [`${data.npm},${data.nama},${kelas}\n`];

    result.push(content);
  });

  return result;
};

const data = readDataMaba(`${__dirname}/mabaDummy.csv`, 'TI-D');

const writeData = (data2) => {
  data2.forEach((record) => {
    console.log(record);
    fs.writeFileSync(`${__dirname}/maba2021.csv`, record[0], { flag: 'a' });
  });
};
writeData(data);
