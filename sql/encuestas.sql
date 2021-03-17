-- DB CREATION

CREATE DATABASE IF NOT EXISTS surveys;

use surveys;

-- TABLES CREATION

CREATE TABLE IF NOT EXISTS surveys (
	id int NOT NULL auto_increment,
	title varchar(255),
	description varchar(255),
	startdate date,
	enddate date,
	creationdate date,
	ispublish BOOLEAN,
	resultspublish BOOLEAN,
	PRIMARY KEY( id )
);

CREATE TABLE IF NOT EXISTS questions (
	id int NOT NULL auto_increment,
	question varchar(255),
	type varchar(255),
	surveyId int,
	PRIMARY KEY(id),
    FOREIGN KEY(surveyId) REFERENCES surveys(id)
);

CREATE TABLE IF NOT EXISTS options (
	id int NOT NULL auto_increment,
	optionName varchar(255),
	votes int,
	questionId int,
	PRIMARY KEY( id ),
    FOREIGN KEY(questionId) REFERENCES questions(id)
);

-- PROCEDURES
DROP PROCEDURE IF EXISTS createSurvey;

DELIMITER //
CREATE PROCEDURE  createSurvey(IN _title VARCHAR(255),
IN _description VARCHAR(255),
IN _startdate date,
IN _enddate date,
IN _creationdate date,
OUT _id int
)
BEGIN
  INSERT into surveys (title, description, startdate, enddate, creationdate, ispublish, resultspublish)
  VALUES (_title, _description, _startdate, _enddate, _creationdate, FALSE, FALSE);
  SET _id = (SELECT LAST_INSERT_ID());
  SELECT _id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS createQuestion;

DELIMITER //
CREATE PROCEDURE  createQuestion(
IN _title VARCHAR(255),
IN _type VARCHAR(255),
IN _surveyId int,
OUT _id int
)
BEGIN
  INSERT into questions (question, type, surveyId)
  VALUES (_title, _type, _surveyId);
  SET _id = (SELECT LAST_INSERT_ID());
  SELECT _id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS createOption;

DELIMITER //
CREATE PROCEDURE  createOption(
IN _title VARCHAR(255),
IN _questionId int,
OUT _id int
)
BEGIN
  INSERT into options (optionName, votes, questionId)
  VALUES (_title, 0, _questionId);
  SET _id = (SELECT LAST_INSERT_ID());
  SELECT _id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getSurveys;

DELIMITER //
CREATE PROCEDURE  getSurveys()
BEGIN
  SELECT options.*, questions.id ,questions.question, questions.type, questions.surveyId, surveys.title, surveys.description, surveys.startdate, surveys.enddate, surveys.creationdate, surveys.ispublish,surveys.resultspublish
      FROM options
          RIGHT OUTER JOIN questions
              ON options.questionId = questions.id
                RIGHT OUTER JOIN surveys ON questions.surveyId = surveys.id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getSurveyById;

DELIMITER //
CREATE PROCEDURE  getSurveyById(IN _id INT)
BEGIN
  SELECT options.*,questions.id, questions.question, questions.type, questions.surveyId, surveys.title, surveys.description, surveys.startdate, surveys.enddate, surveys.creationdate, surveys.ispublish,surveys.resultspublish
      FROM options
          RIGHT OUTER JOIN questions
              ON options.questionId = questions.id
                RIGHT OUTER JOIN surveys ON questions.surveyId = surveys.id
                    WHERE surveyId = _id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS deleteSurveyById;

DELIMITER //
CREATE PROCEDURE  deleteSurveyById(IN _id INT)
BEGIN
    DECLARE optionsId INT;
    DECLARE questionsId INT;
    DECLARE done INT DEFAULT 0;

    DECLARE options_cursor CURSOR FOR
    SELECT options.id
      FROM options
          RIGHT OUTER JOIN questions
              ON options.questionId = questions.id
                RIGHT OUTER JOIN surveys ON questions.surveyId = surveys.id
                    WHERE surveyId = _id;

    DECLARE questions_cursor CURSOR FOR
    SELECT questions.id
      FROM questions
              RIGHT OUTER JOIN surveys ON questions.surveyId = surveys.id
                    WHERE surveyId = _id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN options_cursor;
    options: LOOP
        FETCH options_cursor INTO optionsId;
        IF done = 1 THEN
            LEAVE options;
        END IF;
        DELETE FROM options where id = optionsId;
    END LOOP options;
    CLOSE options_cursor;

    SET done = 0;

    OPEN questions_cursor;
    questions: LOOP
        FETCH questions_cursor INTO questionsId;
        IF done = 1 THEN
            LEAVE questions;
        END IF;
        DELETE FROM questions where id = questionsId;
    END LOOP questions;
    CLOSE questions_cursor;

    DELETE FROM surveys where id = _id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS turnSurveyById;

DELIMITER //
CREATE PROCEDURE turnSurveyById(IN _id INT)
BEGIN
    DECLARE _ispublish BOOLEAN;
    SELECT ispublish into _ispublish from surveys where id = _id;
    IF _ispublish = 0 THEN
        SET _ispublish = TRUE;
    ELSE
        SET _ispublish = FALSE;
    end if;
    UPDATE surveys SET ispublish=_ispublish WHERE id = _id;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS toggleResultsSurveyById;

DELIMITER //
CREATE PROCEDURE toggleResultsSurveyById(IN _id INT)
BEGIN
    DECLARE _results BOOLEAN;
    SELECT resultspublish into _results from surveys where id = _id;
    IF _results = 0 THEN
        SET _results = TRUE;
    ELSE
        SET _results = FALSE;
    end if;
    UPDATE surveys SET resultspublish=_results WHERE id = _id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS addVotes;

DELIMITER //
CREATE PROCEDURE addVotes(IN _id INT, IN _option VARCHAR(255))
BEGIN
    DECLARE _votes int;
    DECLARE _optionId int;
    DECLARE _questionId int;
    DECLARE _type varchar(255);
    SELECT votes, options.id, questions.type, questions.id into _votes, _optionId, _type, _questionId
      FROM options
          RIGHT OUTER JOIN questions
              ON options.questionId = questions.id
                RIGHT OUTER JOIN surveys ON questions.surveyId = surveys.id
                    WHERE surveyId = _id AND optionName = _option;


    SET _votes = _votes + 1;
    UPDATE options SET votes=_votes WHERE id = _optionId;

    IF _optionId IS NULL THEN
        SELECT questions.Id into _questionId from questions
            RIGHT OUTER JOIN surveys s on questions.surveyId = s.id
                WHERE surveyId = _id AND questions.type = 'OPEN';
        INSERT into options (optionName, votes, questionId)
          VALUES (_option, 1, _questionId);
    END IF;
END //
DELIMITER ;