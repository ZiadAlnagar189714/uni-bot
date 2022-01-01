const tours = require("../model/tours");
const student = require("../../model/student");

const path = require("path");

exports.addStudentToTour = async (req, res, next) => {
    let mail = req.session.email;
    let fac = req.session.faculty;
    let isReg = req.session.isEnrolled;

    // console.log(mail, fac, isReg);

    if (isReg == 0) {
        console.log(
            `Your are not enrolled in the ${fac} make sure you are enrolled then try again later`
        );
    }

    //console.log(req.session.email)
    else
        tours.findOne({ StudentEmail: mail }, function (err, docs) {
            if (err) {
                console.log("You Already Registred on this campus tour");
            } else {
                tours.findOne({ Faculty: fac }).exec(async (err, tour1) => {
                    if (err)
                        res.send("Your faculty doesnt have a campus tours");

                    console.log(tour1);

                    if (tour1.NumofStudents > 20) {
                        console.log(
                            "Sorry, Campus tour is full, try another time"
                        );
                    } else {
                        try {
                            let i = tour1.StudentEmail.length;
                            tour1.NumofStudents = tour1.NumofStudents + 1;
                            tour1.StudentEmail[i + 1] = mail;
                            const tourIn = tours.updateOne({ Faculty: fac }, tour1, (err, db) => {
                                return res.status(200).json({
                                    success: true,
                                });
                            });
                        } catch (err) {
                            console.error(err);
                            res.status(500).json({ error: "Server error 101" });
                        }
                    }
                });
            }
        });
};
