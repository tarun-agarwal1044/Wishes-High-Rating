const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cors = require('cors');
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(bodyParser.json());
app.use(cors());



const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/lsampleDB", { useNewUrlParser: true });


const sampleSchema = new mongoose.Schema({
    userName: String,
    password: String,
    handle: String,
    todoList: [{
        contestId: String,
        name: String
    }],
    rejList: [{
        contestId: String,
        name: String
    }]
});

const Lsample = mongoose.model("Lsample", sampleSchema);

// const lsample = new Lsample({
//     userName: "harsh",
//     password: "abcdef",
//     handle: "harsh_27",
//     todoList: []
// });


// const rate = new Rate({
//     handle: "harsh_27"
// });


//rate.save();

//const members = httpcodeforces.com/api/contest.list?gym=true;
// app.post("/rating", function (req, res) {
//     console.log(req.body);
//     res.send("Hello");
// })




async function calculation(handle ,userName, res) {
    // console.log("haufhaefffeeafea" + Lsample.find({ handle: handle }));
    var rat;
    var arr = [];
    const url = "https://codeforces.com/api/problemset.problems";
    const urlrat = "https://codeforces.com/api/user.info?handles=" + handle;
    const usersum = "https://codeforces.com/api/user.status?handle=" + handle;
    //console.log(response.statusCode)
    const lsamples = await Lsample.find({ userName: userName })

    // console.log("tarun" + lsamples);
    var todoarr = [];
    var removearr = [];
    for (var i = 0; i < lsamples[0].todoList.length; i++) {
        todoarr.push(lsamples[0].todoList[i].name)
    }
    for (var i = 0; i < lsamples[0].rejList.length; i++) {
        removearr.push(lsamples[0].rejList[i].name)
    }
    // console.log(removearr);
    var data;
    var user_arr = [];
    https.get(urlrat, function (res1) {
        res1.on("data", function (data) {
            rat = (JSON.parse(data)).result[0].rating;
            //console.log(rat);
            https.get(usersum, function (res2) {
                data = "";
                res2.on("data", function (chunk) {
                    if (!data) {
                        data = chunk;
                    } else {
                        data += chunk;
                    }
                })
                res2.on("end", function () {
                    var ans1 = JSON.parse(data);
                    var temp1 = ans1.result;
                    for (var i = 0; i < temp1.length; i++) {
                        if (temp1[i].verdict == "OK") {
                            var x = user_arr.indexOf(temp1[i].problem.name)
                            if (x == -1) {
                                user_arr.push(temp1[i].problem.name)
                            }
                        }
                    }

                    //console.log(user_arr);
                    // console.log(rat);
                    // console.log(user_arr.length);
                    https.get(url, function (response) {

                        data = "";

                        response.on("data", function (chunk) {
                            if (!data) {
                                data = chunk;
                            }
                            else {
                                data += chunk;
                            }
                        })
                        response.on("end", function () {
                            var ans = JSON.parse(data);
                            var temp = ans.result.problems;

                            var rem = rat % 100;
                            var vrat = rat;
                            if (rem == 0) {
                                vrat += 100;
                            }
                            else {
                                vrat -= rem;
                                vrat += 100;
                            }
                            //console.log(vrat);
                            //console.log(temp);
                            arr = [];
                            var cnt = 0;
                            for (var i = 0; i < temp.length && cnt < 10; i++) {
                                var x = user_arr.indexOf(temp[i].name)
                                var y = todoarr.indexOf(temp[i].name);
                                var z = removearr.indexOf(temp[i].name);
                                if (temp[i].rating == vrat && x == -1 && y == -1 && z == -1) {
                                    // console.log(temp[i]);
                                    arr.push(temp[i]);
                                    cnt++;
                                }
                                //arr.push(temp[i]);
                            }
                            //console.log(temp.length);
                            // console.log(arr);
                            // console.log(arr.length);
                            // console.log(rat);
                            // console.log(user_arr.length);
                            if (arr.length != 0) {
                                let obj = {
                                    rating: rat,
                                    ques: arr
                                };
                                res.json(obj);
                            }
                            else {
                                if (rat > 0) {
                                    arr = [];
                                    var cnt = 0;
                                    for (var i = 0; i < temp.length && cnt < 10; i++) {
                                        var x = user_arr.indexOf(temp[i].name)
                                        if (x == -1) {
                                            // console.log(temp[i]);
                                            arr.push(temp[i]);
                                            cnt++;
                                        }
                                        //arr.push(temp[i]);
                                    }
                                    let obj = {
                                        rating: rat,
                                        ques: arr
                                    };
                                    res.json(obj);
                                }
                                else {
                                    let obj = {
                                        rating: 0,
                                        ques: []
                                    };
                                    res.json(obj);
                                }

                            }
                            res.send();
                        })

                    })
                })

            })
        })
    })
}
// var objFriends = { fname: "fname", lname: "lname", surname: "surname" };
// Friend.findOneAndUpdate(
//     { _id: req.body.id },
//     { $push: { friends: objFriends } },
//     function (error, success) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(success);
//         }
//     });
// )
app.post("/list",async function (req, res) {
    var name_ques = req.body.name;
    var user_userName = req.body.userName;
    var contestId_check = req.body.contestId;
    // console.log(req.body)
    var add = { contestId: contestId_check, name: name_ques };
    // console.log(add);


    // if (add.name !== '') {
    //     lsample.todoList.push(add);
    //     await lsample.save();
    // }
    // await Lsample.findOneAndUpdate({ userName: user_userName }, { $push: { todoList: add } }, function (error, success) {
    //     if (error) {
    //         let p = 1;
    //     }
    //     else {
    //         let p = 1;
    //     }
    // }
    // );


     await Lsample.findOne({ userName: user_userName },
            async (error, item) => {
                if (error) {
                    let p = 1;
                }
                else {
                    if (add.name !== '') {
                        item.todoList.push(add);
                        await item.save();
                    }
                }
            });

    const lsample = await Lsample.find({userName : user_userName});





    console.log("lsample      " +lsample);

    // res.json(lsample.todoList);
    // res.send();
    


    var todoarr = [{    contestId: '',
                name: '',
                        }];
        todoarr=lsample[0].todoList;
        console.log("todoarrrrrrrrrrrrr     " + todoarr );
    //     console.log("todoarr   " + todoarr);
                            // let obj = {
                            //     doques_name: todoarr.name,
                            //     doques_id: todoarr.contestId
                            // }
    
                            let obj = {
                                doques: todoarr
                            };
                            // console.log(obj.doques);
                            res.json(obj.doques);
                            res.send();
                            // console.log("hello......");



    // Lsample.findOne({ userName: user_userName },
    //     async (error, item) => {
    //         if (error) {
    //             let p = 1;
    //         }
    //         else {
    //             if (add.name !== '') {
    //                 item.todoList.push(add);
    //                 await item.save();
    //             }
    //             Lsample.find(function (err, lsamples) {
    //                 if (err) {
    //                     let p = 1;
    //                     res.send();
    //                 }
    //                 else {
    //                     var todoarr = [{
    //                         contestId: '',
    //                         name: ''
    //                     }];
    //                     lsamples.forEach(function (lsample) {
    //                         if (user_userName == lsample.userName) {
    //                             todoarr = lsample.todoList;
    //                             // console.log(todoarr);
    //                         }

    //                     });
    //                     // let obj = {
    //                     //     doques_name: todoarr.name,
    //                     //     doques_id: todoarr.contestId
    //                     // }

    //                     let obj = {
    //                         doques: todoarr
    //                     };
    //                     console.log(obj.doques);
    //                     res.json(obj.doques);
    //                     res.send();
    //                     // console.log("hello......");
    //                 }
    //             });

    //         }
    //     }
    // )

    // Lsample.findOneAndUpdate(
    //     { handle: handle_user },
    //     { $push: { todoList: add } },
    //     function (error, success) {
    //         if (error) {
    //             let p = 1;
    //         }
    //         else {
    //             let p = 1;
    //         }
    //     }
    // ).then(() => {

    // })
    // //console.log("Hello......");
})
app.post("/uwlist",async function (req, res) {
    var name_ques = req.body.name;
    var user_userName = req.body.userName;
    var contestId_check = req.body.contestId;
    var add = { contestId: contestId_check, name: name_ques };
    Lsample.findOneAndUpdate({ userName: user_userName }, { $push: { rejList: add } }, function (error, success) {
        if (error) {
            let p = 1;
        }
        else {
            let p = 1;
        }
    }
    );
    Lsample.findOneAndUpdate({ userName: user_userName }, { $pull: { todoList: add } }, function (error, success) {
        if (error) {
            let p = 1;
        }
        else {
            let p = 1;
        }
    }
    );


    const lsample = await Lsample.find({userName : user_userName});





    console.log("lsample      " +lsample);

    // res.json(lsample.todoList);
    // res.send();
    


    var todoarr = [{    contestId: '',
                name: '',
            }];
        todoarr=lsample[0].todoList;
        console.log("todoarrrrrrrrrrrrr     " + todoarr );
    //     console.log("todoarr   " + todoarr);
                            // let obj = {
                            //     doques_name: todoarr.name,
                            //     doques_id: todoarr.contestId
                            // }
    
                            let obj = {
                                doques: todoarr
                            };
                            // console.log(obj.doques);
                            res.json(obj.doques);
                            res.send();




    // Lsample.findOne({ userName: user_userName },
    //     async (error, item) => {
    //         if (error) {
    //             let p = 1;
    //         }
    //         else {
    //             Lsample.find(function (err, lsamples) {
    //                 if (err) {
    //                     let p = 1;
    //                     res.send();
    //                 }
    //                 else {
    //                     var todoarr = [{
    //                         contestId: '',
    //                         name: ''
    //                     }];
    //                     lsamples.forEach(function (lsample) {
    //                         if (user_userName == lsample.userName) {
    //                             todoarr = lsample.todoList;
    //                             // console.log(todoarr);
    //                         }

    //                     });
    //                     // let obj = {
    //                     //     doques_name: todoarr.name,
    //                     //     doques_id: todoarr.contestId
    //                     // }

    //                     let obj = {
    //                         doques: todoarr
    //                     };
    //                     //console.log(obj.doques);
    //                     res.json(obj.doques);
    //                     res.send();
    //                     // console.log("hello......");
    //                 }
    //             });

    //         }
    //     }
    // )
})
app.post("/nrating", function (req, res) {
    const handle = req.body.handle;
    const userName = req.body.userName;
    var password = req.body.password;
    const sample_password = password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        password = hash;
    });
    // console.log(req.body);

    Lsample.count({userName : userName} , async function (err, count){ 
        if(count>0)
        {
            // console.log("count " + count);

            const lsample = await Lsample.find({ userName : userName});

            // console.log(lsample);
                            var check = false;
                             await bcrypt.compare(sample_password, lsample[0].password, function (err, res1) {
                                //  console.log(sample_password);
                                //  console.log(lsample[0].password);
                                check = res1;
                                if(check && lsample[0].handle == handle)
                                {
                                    calculation(handle, userName, res);
                                }
                                else
                                {
                                    let obj = {
                                        rating: -2,
                                        ques: []
                                    };
                                    res.json(obj);
                                    res.send();
                                }

                                // console.log("x " +x );
                                // console.log(res);
                                // console.log("inside bcrypt");
                            });

            
            
        }
        else{
            const urlrat = "https://codeforces.com/api/user.info?handles=" + handle;
                https.get(urlrat, function (res1) {
                    res1.on("data", function (data) {
                        var check = (JSON.parse(data)).status;
                        console.log(check);
                        if (check == "FAILED") {
                            console.log("Invalid Handle");
                            let obj = {
                                rating: -1,
                                ques: []
                            };
                            res.json(obj);
                            res.send();
                        } else {
                            // contestId: String,
                            //     name: String
                            const lsample = new Lsample({
                                userName: userName,
                                password: password,
                                handle: handle,
                                todoList: [],
                                rejList: []
                            });
                            lsample.save();
                            calculation(handle ,userName, res);
                        }
                    })
                })

        }
    });
   


})

// app.get("/nrating", function (req, res) {

//     res.write("User Rating " + rat);
//     res.send();

//     //res.send("Server is UP and running");

// })


app.listen(5000, function (req, res) {
    console.log("Server is runnung at port 5000")
})
//db.lsamples.update({"handle":"abc123"},{ $push: { "rejList": "Hello" }});