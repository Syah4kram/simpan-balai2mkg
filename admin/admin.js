const displayTime = () => {
    moment.locale("id");
    $(".time").text(moment().format("LTS"));
    $(".date").text(moment().format("LL"));
};

const utcTime = () => {
    $(".utc").text(moment.utc().format("LTS"));
};

const updateTime = () => {
    displayTime();
    utcTime();
    setTimeout(updateTime, 1000)
};

updateTime();

var base_url = "https://api.jsonbin.io/b/602e50115605851b065f4f47/latest";
var urlParams = new URLSearchParams(window.location.search);
var idParam = urlParams.get("id");
var actionsParam = urlParams.get("actions");

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

const fetchApi = url => {
    return fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "secret-key": "$2b$10$pkQJlh7piyQKy/CPJjLmNOodNjMCLod3Ov5Ge7v76Qfwajjxem9ga"
        }
    });
};

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getDetailsById() {
    return new Promise(function (resolve, reject) {

        fetchApi(base_url)
            .then(status)
            .then(json)
            .then(function (data) {
                console.log(data);
                var dataDetails = ``;
                data.datas.forEach(function (dat) {
                    if (idParam == dat.id) {
                        if (dat.kondisi == "rusak") {
                            color = "text-danger";
                        } else {
                            color = "text-info";
                        }
                        dataDetails += `
                        <div id="konten">
                            <div style="padding: 15px">
                                <h3>Detail Alat</h3>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Nama Alat:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${dat.nama}</p></div>
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Kondisi:</strong></div>
                                    <div class="col-sm-4 p-3"><p class="${color}">${dat.kondisi}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Merk:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${dat.merk}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Tipe:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${dat.tipe}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Nomor Seri:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${dat.noSeri}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Terakhir Dikalibrasi:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${moment(dat.terakhirKalibrasi, 'MM-DD-YYYY').format("LL")}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Tanggal Kalibrasi Selanjutnya:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${moment(dat.jadwalKalibrasi, 'MM-DD-YYYY').format("LL")}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Terakhir Digunakan:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${moment(dat.terakhirDigunakan, 'MM-DD-YYYY').format("LL")}</p></div>    
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Keterangan:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${dat.ket}</p></div>
                                </div>
                                <div class="row align-middle">
                                    <div class="col-sm-4 bg-light p-3"><strong>Tag:</strong></div>
                                    <div class="col-sm-4 p-3"><p>${dat.tag}</p></div>
                                </div>
                                <div class="text-center">
                                    <p>Data ini diperoleh dari</p>
                                    <img src="../banner-black.png" width="194px">
                                </div>
                            </div>
                        </div>
                        `;
                    }
                });
                dataDetails += `
                <a onclick="generatePDF()" href="#" class="btn btn-info" id="convert" style="margin: 20px 0 40px">Unduh Data</a>
                <a href="./admin/admin.html?id=${idParam}&actions=edit" class="btn btn-primary" style="margin: 20px 0 40px">Ubah</a>
                `;
                document.getElementById("body-content").innerHTML = dataDetails;
                resolve(data);
            })
            .catch(error);
    });
}

function generatePDF() {
    const element = document.getElementById("konten");
    html2pdf()
        .set({
            html2canvas: {
                scale: 8
            }
        })
        .from(element)
        .save();
}

function getEditById() {
    return new Promise(function (resolve, reject) {

        fetchApi(base_url)
            .then(status)
            .then(json)
            .then(function (data) {
                console.log(data);
                var dataDetails = ``;
                data.datas.forEach(function (dat) {
                    if(screen.width < 960) clas = "col-sm-4"
                    else clas = "col";
                    if (idParam == dat.id) {
                        dataDetails += `
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Nama Alat: </strong></label>
                            <input type="text" name="nama" value="${dat.nama}" class="form-control ${clas}">
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Kondisi: (Rusak/Baik)</strong></label>
                            <input type="text" name="kondisi" value="${dat.kondisi}" class="form-control ${clas}">
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Merk: </strong></label>
                            <input type="text" name="merk" value="${dat.merk}" class="form-control ${clas}"> 
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Tipe: </strong></label>
                            <input type="text" name="tipe" value="${dat.tipe}" class="form-control ${clas}">  
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Nomor Seri: </strong></label>
                            <input type="text" name="noSeri" value="${dat.noSeri}" class="form-control ${clas}"> 
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Terakhir Kalibrasi (MM-DD-YYYY): </strong></label>
                            <input type="text" name="terakhirKalibrasi" value="${dat.terakhirKalibrasi}" class="form-control ${clas}">  
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Kalibrasi Selanjutnya (MM-DD-YYYY): </strong></label>
                            <input type="text" name="jadwalKalibrasi" value="${dat.jadwalKalibrasi}" class="form-control ${clas}">   
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Terakhir Digunakan (MM-DD-YYYY): </strong></label>
                            <input type="text" name="terakhirDigunakan" value="${dat.terakhirDigunakan}" class="form-control ${clas}"> 
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Keterangan: </strong></label>
                            <input type="text" name="ket" value="${dat.ket}" class="form-control ${clas}">
                        </div>
                        <div class="row align-middle">
                            <label class="form-label col-sm-4 bg-light p-3"><strong>Tag (chamber, suhu, kelembapan, termohigro): </strong></label>
                            <input type="text" name="tag" value="${dat.tag}" class="form-control ${clas}">
                        </div>
                        `;
                    }
                });
                dataDetails +=
                    `<a onclick="updateData()" href="#" class="btn btn-info" id="convert" style="margin: 20px 0 40px">Update</a>`;
                document.getElementById("body-content").innerHTML = dataDetails;
                resolve(data);
            })
            .catch(error);
    });
}

function addDataDetails(){
    document.getElementById("body-content").innerHTML = "";
    if(screen.width < 960) clas = "col-sm-4"
    else clas = "col";

    var dataDetails = `
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Nama Alat: </strong></label>
            <input type="text" name="nama" class="form-control ${clas}">
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Kondisi: (Rusak/Baik)</strong></label>
            <input type="text" name="kondisi" class="form-control ${clas}">
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Merk: </strong></label>
            <input type="text" name="merk" class="form-control ${clas}"> 
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Tipe: </strong></label>
            <input type="text" name="tipe" class="form-control ${clas}">  
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Nomor Seri: </strong></label>
            <input type="text" name="noSeri" class="form-control ${clas}"> 
        </div>
        <div class="row align-middle">
                <label class="form-label col-sm-4 bg-light p-3"><strong>Terakhir Kalibrasi (MM-DD-YYYY): </strong></label>
            <input type="text" name="terakhirKalibrasi" class="form-control ${clas}">  
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Kalibrasi Selanjutnya (MM-DD-YYYY): </strong></label>
            <input type="text" name="jadwalKalibrasi" class="form-control ${clas}">   
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Terakhir Digunakan (MM-DD-YYYY): </strong></label>
            <input type="text" name="terakhirDigunakan" class="form-control ${clas}"> 
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Keterangan: </strong></label>
            <input type="text" name="ket" class="form-control ${clas}">   
        </div>
        <div class="row align-middle">
            <label class="form-label col-sm-4 bg-light p-3"><strong>Tag (chamber, suhu, kelembapan, termohigro): </strong></label>
            <input type="text" name="tag" class="form-control ${clas}"> 
        </div>
        <a onclick="addData()" href="#" class="btn btn-info" id="convert" style="margin: 20px 0 40px">Tambah</a>
    `;
    document.getElementById("body-content").innerHTML = dataDetails;
}

function addData() {
    var sendJson = "";

    var namaInput = document.getElementsByName('nama');
    var kondisiInput = document.getElementsByName('kondisi');
    var merkInput = document.getElementsByName('merk');
    var tipeInput = document.getElementsByName('tipe');
    var noSeriInput = document.getElementsByName('noSeri');
    var ketInput = document.getElementsByName('ket');
    var tagInput = document.getElementsByName('tag');
    var terakhirKalibrasiInput = document.getElementsByName('terakhirKalibrasi');
    var jadwalKalibrasiInput = document.getElementsByName('jadwalKalibrasi');
    var terakhirDigunakanInput = document.getElementsByName('terakhirDigunakan');

    var namaVal = [];
    var kondisiVal = [];
    var merkVal = [];
    var tipeVal = [];
    var noSeriVal = [];
    var ketVal = [];
    var tagVal = [];
    var terakhirKalibrasiVal = [];
    var jadwalKalibrasiVal = [];
    var terakhirDigunakanVal = [];

    for (var i = 0; i < namaInput.length; i++) {
        var r = namaInput[i];
        namaVal = namaVal + r.value;
    }
    for (var i = 0; i < kondisiInput.length; i++) {
        var r = kondisiInput[i];
        kondisiVal = kondisiVal + r.value;
    }
    for (var i = 0; i < merkInput.length; i++) {
        var r = merkInput[i];
        merkVal = merkVal + r.value;
    }
    for (var i = 0; i < tipeInput.length; i++) {
        var r = tipeInput[i];
        tipeVal = tipeVal + r.value;
    }
    for (var i = 0; i < noSeriInput.length; i++) {
        var r = noSeriInput[i];
        noSeriVal = noSeriVal + r.value;
    }
    for (var i = 0; i < terakhirKalibrasiInput.length; i++) {
        var r = terakhirKalibrasiInput[i];
        terakhirKalibrasiVal = terakhirKalibrasiVal + r.value;
    }
    for (var i = 0; i < jadwalKalibrasiInput.length; i++) {
        var r = jadwalKalibrasiInput[i];
        jadwalKalibrasiVal = jadwalKalibrasiVal + r.value;
    }
    for (var i = 0; i < terakhirDigunakanInput.length; i++) {
        var r = terakhirDigunakanInput[i];
        terakhirDigunakanVal = terakhirDigunakanVal + r.value;
    }
    for (var i = 0; i < ketInput.length; i++) {
        var r = ketInput[i];
        ketVal = ketVal + r.value;
    }
    for (var i = 0; i < tagInput.length; i++) {
        var r = tagInput[i];
        tagVal = tagVal + r.value;
    }

    fetchApi(base_url)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            sendJson += `
            {"datas": [`;
            data.datas.forEach(function (dat) {
                sendJson += `
                {
                    "id": ${dat.id},
                    "nama": "${dat.nama}",
                    "kondisi": "${dat.kondisi}",
                    "merk": "${dat.merk}",
                    "tipe": "${dat.tipe}",
                    "noSeri": "${dat.noSeri}",
                    "ket": "${dat.ket}",
                    "tag": "${dat.tag}",
                    "terakhirKalibrasi": "${dat.terakhirKalibrasi}",
                    "jadwalKalibrasi": "${dat.jadwalKalibrasi}",
                    "terakhirDigunakan": "${dat.terakhirDigunakan}"
                },
                 `;
            });
            sendJson += `
            {
                "id": ${Object.keys(data.datas).length},
                "nama": "${namaVal}",
                "kondisi": "${kondisiVal}",
                "merk": "${merkVal}",
                "tipe": "${tipeVal}",
                "noSeri": "${noSeriVal}",
                "ket": "${ketVal}",
                "tag": "${tagVal}",
                "terakhirKalibrasi": "${terakhirKalibrasiVal}",
                "jadwalKalibrasi": "${jadwalKalibrasiVal}",
                "terakhirDigunakan": "${terakhirDigunakanVal}"
            }
            ]}`;
            console.log(Object.keys(data.datas).length)

            console.log(sendJson);
            let req = new XMLHttpRequest();

            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    console.log(req.responseText);
                }
            };

            req.open("PUT", "https://api.jsonbin.io/b/602e50115605851b065f4f47", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("secret-key",
                "$2b$10$pkQJlh7piyQKy/CPJjLmNOodNjMCLod3Ov5Ge7v76Qfwajjxem9ga");
            req.setRequestHeader("versioning", "false");
            req.send(sendJson);
        })
        .then(function () {
            M.toast({html: 'Data alat telah ditambahkan!', completeCallback: function(){window.location.href = `../#home`}})
            setTimeout(1000);
        });
        
}

function updateData() {
    var sendJson = "";

    var namaInput = document.getElementsByName('nama');
    var kondisiInput = document.getElementsByName('kondisi');
    var merkInput = document.getElementsByName('merk');
    var tipeInput = document.getElementsByName('tipe');
    var noSeriInput = document.getElementsByName('noSeri');
    var ketInput = document.getElementsByName('ket');
    var tagInput = document.getElementsByName('tag');
    var terakhirKalibrasiInput = document.getElementsByName('terakhirKalibrasi');
    var jadwalKalibrasiInput = document.getElementsByName('jadwalKalibrasi');
    var terakhirDigunakanInput = document.getElementsByName('terakhirDigunakan');

    var namaVal = [];
    var kondisiVal = [];
    var merkVal = [];
    var tipeVal = [];
    var noSeriVal = [];
    var ketVal = [];
    var tagVal = [];
    var terakhirKalibrasiVal = [];
    var jadwalKalibrasiVal = [];
    var terakhirDigunakanVal = [];

    for (var i = 0; i < namaInput.length; i++) {
        var r = namaInput[i];
        namaVal = namaVal + r.value;
    }
    for (var i = 0; i < kondisiInput.length; i++) {
        var r = kondisiInput[i];
        kondisiVal = kondisiVal + r.value;
    }
    for (var i = 0; i < merkInput.length; i++) {
        var r = merkInput[i];
        merkVal = merkVal + r.value;
    }
    for (var i = 0; i < tipeInput.length; i++) {
        var r = tipeInput[i];
        tipeVal = tipeVal + r.value;
    }
    for (var i = 0; i < noSeriInput.length; i++) {
        var r = noSeriInput[i];
        noSeriVal = noSeriVal + r.value;
    }
    for (var i = 0; i < terakhirKalibrasiInput.length; i++) {
        var r = terakhirKalibrasiInput[i];
        terakhirKalibrasiVal = terakhirKalibrasiVal + r.value;
    }
    for (var i = 0; i < jadwalKalibrasiInput.length; i++) {
        var r = jadwalKalibrasiInput[i];
        jadwalKalibrasiVal = jadwalKalibrasiVal + r.value;
    }
    for (var i = 0; i < terakhirDigunakanInput.length; i++) {
        var r = terakhirDigunakanInput[i];
        terakhirDigunakanVal = terakhirDigunakanVal + r.value;
    }
    for (var i = 0; i < ketInput.length; i++) {
        var r = ketInput[i];
        ketVal = ketVal + r.value;
    }
    for (var i = 0; i < tagInput.length; i++) {
        var r = tagInput[i];
        tagVal = tagVal + r.value;
    }

    fetchApi(base_url)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            sendJson += `
            {"datas": [`;
            data.datas.forEach(function (dat) {
                if (dat.id != idParam) {
                    sendJson += `
                    {
                        "id": ${dat.id},
                        "nama": "${dat.nama}",
                        "kondisi": "${dat.kondisi}",
                        "merk": "${dat.merk}",
                        "tipe": "${dat.tipe}",
                        "noSeri": "${dat.noSeri}",
                        "ket": "${dat.ket}",
                        "tag": "${dat.tag}",
                        "terakhirKalibrasi": "${dat.terakhirKalibrasi}",
                        "jadwalKalibrasi": "${dat.jadwalKalibrasi}",
                        "terakhirDigunakan": "${dat.terakhirDigunakan}"
                    }
                    `;
                } else if (dat.id == idParam) {
                    sendJson += `
                    {
                        "id": ${idParam},
                        "nama": "${namaVal}",
                        "kondisi": "${kondisiVal}",
                        "merk": "${merkVal}",
                        "tipe": "${tipeVal}",
                        "noSeri": "${noSeriVal}",
                        "ket": "${ketVal}",
                        "tag": "${tagVal}",
                        "terakhirKalibrasi": "${terakhirKalibrasiVal}",
                        "jadwalKalibrasi": "${jadwalKalibrasiVal}",
                        "terakhirDigunakan": "${terakhirDigunakanVal}"
                    }
                    `;
                } else;
                console.log(Object.keys(data.datas).length)
                if (dat.id != Object.keys(data.datas).length - 1) sendJson += `,`;
            });
            sendJson += `]}`;
        })
        .then(function () {
            console.log(sendJson);
            let req = new XMLHttpRequest();

            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    console.log(req.responseText);
                }
            };

            req.open("PUT", "https://api.jsonbin.io/b/602e50115605851b065f4f47", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("secret-key",
                "$2b$10$pkQJlh7piyQKy/CPJjLmNOodNjMCLod3Ov5Ge7v76Qfwajjxem9ga");
            req.setRequestHeader("versioning", "false");
            req.send(sendJson);
        })
        .then(function () {
            M.toast({html: 'Data alat telah diupdate!', completeCallback: function(){window.location.href = `../details.html?id=${idParam}`}})
            setTimeout(1000);
        });
}

var loginForm = "";
var user = [];
var pw = [];
function signin() {
    if(!(sessionStorage.getItem("uLogin"))){
        loginForm += `
        <h5>Anda harus login untuk mengakses fitur ini.</h5>
        <form id="form_id" method="post" name="loginform">
        <div class="mb-3">
            <label for="uname" class="form-label">Username</label>
            <input type="text" class="form-control" name="uname" id="uname">
        </div>
        <div class="mb-3">
            <label for="pass" class="form-label">Password</label>
            <input type="password" class="form-control" name="pass" id="pass">
        </div>
        <input onclick="login()" type="button" id="submit" value="login" class="btn btn-primary"></input>
        </form>
        `;
        document.getElementById("body-content").innerHTML = loginForm;
    } else {
        login();
    }
}

function pilih(){
    fetchApi(base_url)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data);
            var listData = ``;
            var color = "";

            listData += `
            <h5>Selamat Datang, ${sessionStorage.getItem("namaDepan")}.</h5>
            <div class="row">
                <div class="col-sm-2 p-3">
                    <input onclick="addDataDetails()" type="button" id="submit" value="Tambah Data Alat" class="btn waves-effect waves-light"></input>
                </div>
            </div>
            <div style="margin: 50px 0"></div>
            `;

            data.datas.forEach(function (dat) {
                if(dat.merk == "-") {merkv = ""} else merkv = dat.merk
                if(dat.tipe == "-") {tipe = ""} else tipe = dat.tipe
                if (dat.kondisi == "rusak") {
                    color = "text-danger";
                } else {
                    color = "text-info";
                }
                listData += `
                <div class="row align-middle">
                    <div class="col-sm-3 bg-light p-3"><a href="../details.html?id=${dat.id}"><p>${dat.nama}</p><p class="${color}">${dat.kondisi}</p></a></div>
                    <div class="col-sm-5 p-3"><p>${merkv} ${tipe} (no. seri: ${dat.noSeri})</p></div>
                    <div class="col-sm-2 p-3"><a href="./admin.html?id=${dat.id}&actions=edit" class="btn waves-effect waves-light" style="margin: 20px 0 40px">Ubah</a></div>
                    <div class="col-sm-2 p-3"><a href="./admin.html?id=${dat.id}&actions=delete" onclick="deleteAlat()" class="btn waves-effect waves-light" style="margin: 20px 0 40px">Hapus</a></div>
                </div>
                `;
            });

            document.getElementById("body-content").innerHTML = listData;
        })
}

function deleteAlat(){
    var sendJson = "";
    fetchApi(base_url)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            sendJson = `
            {"datas": [`;
            data.datas.forEach(function (dat) {
                if (dat.id != idParam) {
                    sendJson += `
                    {
                        "id": ${dat.id},
                        "nama": "${dat.nama}",
                        "kondisi": "${dat.kondisi}",
                        "merk": "${dat.merk}",
                        "tipe": "${dat.tipe}",
                        "noSeri": "${dat.noSeri}",
                        "ket": "${dat.ket}",
                        "tag": "${dat.tag}",
                        "terakhirKalibrasi": "${dat.terakhirKalibrasi}",
                        "jadwalKalibrasi": "${dat.jadwalKalibrasi}",
                        "terakhirDigunakan": "${dat.terakhirDigunakan}"
                    }
                    `;
                } else if (dat.id == idParam) {
                    sendJson += ``;
                } else;
                console.log(Object.keys(data.datas).length-2)
                if (dat.id != Object.keys(data.datas).length-2 && dat.id != Object.keys(data.datas).length-1 && dat.id != idParam) sendJson += `,`;
            });
            sendJson += `]}`;
        })
        .then(function () {
            console.log(sendJson);
            let req = new XMLHttpRequest();

            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    console.log(req.responseText);
                }
            };

            req.open("PUT", "https://api.jsonbin.io/b/602e50115605851b065f4f47", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("secret-key",
                "$2b$10$pkQJlh7piyQKy/CPJjLmNOodNjMCLod3Ov5Ge7v76Qfwajjxem9ga");
            req.setRequestHeader("versioning", "false");
            req.send(sendJson);
        })
        .then(function () {
            M.toast({html: 'Data alat dihapus!', completeCallback: function(){window.location.href = `./admin.html`}})
        });
}

function login() {
    var userI = document.getElementsByName('uname');
    var pwI = document.getElementsByName('pass');
    if(!(sessionStorage.getItem("uLogin")) && !(sessionStorage.getItem("pLogin"))){
        for (var i = 0; i < userI.length; i++) {
            var r = userI[i];
            user = user + r.value;
        }
        for (var i = 0; i < pwI.length; i++) {
            var r = pwI[i];
            pw = pw + r.value;
        }
    } else {
        user = sessionStorage.getItem("uLogin");
        pw = sessionStorage.getItem("pLogin");
    }

    fetchApi("https://api.jsonbin.io/b/6031053fa3e9f25d023ca76e")
        .then(status)
        .then(json)
        .then(function (data) {
            if (data.username == user && data.password == pw) {
                document.getElementById("body-content").innerHTML = "";

                sessionStorage.setItem("uLogin", data.username);
                sessionStorage.setItem("pLogin", data.password);
                sessionStorage.setItem("namaDepan", data.namaDepan);
                if (actionsParam == "edit") {
                    getEditById()
                } else if (actionsParam == "add") {
                    addDataDetails();
                } else if (actionsParam == "delete") {
                    deleteAlat();
                } else {
                    pilih();
                }
            } else {
                M.toast({html: 'Username dan Password Anda salah.'})
            }
        })
}