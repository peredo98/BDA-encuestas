var express = require("express"); //importar express
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors());
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //APi va a vivir en este puerto

// DB connection
var mysql = require("mysql");
var db = mysql.createConnection({
  host: "db-base-de-datos-avanzadas.cfqqyqdorfzh.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Emsap.2014",
  database: "surveys",
  multipleStatements: true,
});

var router = express.Router();

router.use(function (req, res, next) {
  next();
}); //funcion habilita el middleware

router.get("/", function (req, res) {
  res.json({
    mensaje: "keep alive",
  });
});

//post and get surveys
router
  .route("/surveys")
  .post(function (req, res) {
    if (!req.body.title) {
      res.status(400).send({
        error: "La encuesta tiene que tener un titulo para ser creada",
      });
      return;
    } else if (!req.body.startDate) {
      res.status(400).send({
        error:
          "La encuesta tiene que tener una fecha de comienzo para ser creada",
      });
      return;
    } else if (!req.body.endDate) {
      res.status(400).send({
        error:
          "La encuesta tiene que tener una fecha de término para ser creada",
      });
      return;
    } else if (!req.body.creationDate) {
      res.status(400).send({
        error:
          "La encuesta tiene que tener una fecha de creación para ser creada",
      });
      return;
    } else if (!req.body.description) {
      res.status(400).send({
        error: "La encuesta tiene que tener una descripción para ser creada",
      });
      return;
    } else if (!req.body.questions) {
      res.status(400).send({
        error: "La encuesta tiene que tener preguntas para ser creada",
      });
      return;
    }

    db.query(
      "call createSurvey(?,?,?,?,?,@output);",
      [
        req.body.title,
        req.body.description,
        req.body.startDate,
        req.body.endDate,
        req.body.creationDate,
      ],
      function (error, rows) {
        if (error) {
          res.status(400).send(error);
        } else {
          var surveyId = rows[0][0];
          req.body.questions.forEach((question) => {
            db.query(
              "call createQuestion(?,?,?,@output);",
              [question.title, question.type, surveyId._id],
              function (error, rows) {
                if (error) {
                  res.status(400).send(error);
                  return;
                } else {
                  var questionId = rows[0][0];
                  question.options.forEach((option) => {
                    db.query(
                      "call createOption(?,?,@output);",
                      [option.title, questionId._id],
                      function (error, rows) {
                        if (error) {
                          res.status(400).send(error);
                          return;
                        }
                      }
                    );
                  });
                }
              }
            );
          });
          res.status(201).send(surveyId);
        }
      }
    );
  })

  .get(function (req, res) {
    db.query("call getSurveys();", function (error, rows) {
      if (error) {
        res.status(400).send(error);
      } else {
        var unstructuredJson = rows[0];
        var surveys = [];
        var questions = [];

        unstructuredJson.forEach((option) => {
          if (!questions.some((q) => q._id == option.questionId)) {
            questions.push({
              _id: option.questionId != null ? option.questionId : option.id,
              title: option.question,
              type: option.type,
              options: [],
            });
          }
        });

        questions.forEach((question) => {
          unstructuredJson.forEach((option) => {
            if (question._id == option.questionId) {
              question.options.push({
                _id: option.id,
                title: option.optionName,
                votes: option.votes,
              });
            }
            if (!surveys.some((s) => s._id == option.surveyId)) {
              surveys.push({
                _id: option.surveyId,
                title: option.title,
                description: option.description,
                startDate: option.startdate,
                endDate: option.enddate,
                creationDate: option.creationdate,
                isPublish: option.ispublish == 0 ? false : true,
                resultsPublish: option.resultspublish == 0 ? false : true,
                questions: questions,
              });
            }
          });
        });

        res.status(200).send(surveys);
      }
    });
  });

//get specific survey and delete specific survey

router
  .route("/surveys/:id_survey")
  .get(function (req, res) {
    db.query("call getSurveyById(?);", [req.params.id_survey], function (
      error,
      rows
    ) {
      if (error) {
        res.status(400).send(error);
      } else {
        var unstructuredJson = rows[0];
        var survey;
        var questions = [];

        unstructuredJson.forEach((option) => {
          if (!questions.some((q) => q._id == option.questionId)) {
            questions.push({
              _id: option.questionId != null ? option.questionId : option.id,
              title: option.question,
              type: option.type,
              options: [],
            });
          }
        });

        questions.forEach((question) => {
          unstructuredJson.forEach((option) => {
            if (question._id == option.questionId) {
              question.options.push({
                _id: option.id,
                title: option.optionName,
                votes: option.votes,
              });
            }
            survey = {
              _id: option.surveyId,
              title: option.title,
              description: option.description,
              startDate: option.startdate,
              endDate: option.enddate,
              creationDate: option.creationdate,
              isPublish: option.ispublish == 0 ? false : true,
              resultsPublish: option.resultspublish == 0 ? false : true,
              questions: questions,
            };
          });
        });

        res.status(200).send(survey);
      }
    });
  })
  .delete(function (req, res) {
    db.query("call deleteSurveyById(?);", [req.params.id_survey], function (
      error,
      rows
    ) {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send(rows);
      }
    });
  });

//Toggle survey to be Hidden or Published
router.route("/surveys/:id_survey/turn").put(function (req, res) {
  db.query("call turnSurveyById(?);", [req.params.id_survey], function (
    error,
    rows
  ) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).send(rows);
    }
  });
});

//Toggle results to be Hidden or Published
router.route("/surveys/:id_survey/results").put(function (req, res) {
  db.query(
    "call toggleResultsSurveyById(?);",
    [req.params.id_survey],
    function (error, rows) {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send(rows);
      }
    }
  );
});

//Add votes to a specific survey
router.route("/surveys/:id_survey/addVotes").put(function (req, res) {
  if (!req.body.selectedOptions) {
    res.status(400).send({ error: "Tiene que haber opciones seleccionadas" });
    return;
  }

  var selectedOptions = req.body.selectedOptions;

  if (selectedOptions.length == 0) {
    res.status(400).send({ error: "Tiene que haber opciones seleccionadas" });
    return;
  }

  selectedOptions.forEach((answer) => {
    if (!answer.options || !answer.questionId) {
      res.status(400).send({ error: "Tiene que haber opciones seleccionadas" });
      return;
    }
    let questionId = answer.questionId;
    answer.options.forEach((option) => {
      db.query("call addVotes(?, ?, ?);", [req.params.id_survey, option, questionId], function (
        error,
        rows
      ) {
        if (error) {
          res.status(400).send(error);
          return;
        }
      });
    });
  });
  res.status(200).send(req.body);
});

app.use("/api", router); //url base de nuestro api que tiene las rutas en el router

app.listen(port); //abre el puerto que escucha

console.log("servidor arriba");
