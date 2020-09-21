import React, { useState, useContext } from "react";
import styles from "./Home.module.css";
import { withRouter } from "react-router-dom";
import {
  Avatar,
  Grid,
  Paper,
  Card,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  TextareaAutosize,
} from "@material-ui/core";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import StorageIcon from "@material-ui/icons/Storage";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { AddCircle, Settings } from "@material-ui/icons";
import classNames from "classnames";
import { GlobalContext } from "../../Context/GlobalContext";
import DeleteIcon from "@material-ui/icons/Delete";
import { v4 as uuidv4 } from "uuid";
import { Syllabus, Data } from "../../Components";

const Home = ({ history }) => {
  const CurrentComponent = () => {
    switch (history.location.pathname) {
      case "/questions":
        return <QuestionsComponent />;
      case "/syllabus":
        return <Syllabus />;
      case "/data":
        return <Data />;
      default:
        return <QuestionsComponent />;
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.innerContainer}>
        <Grid container spacing={0}>
          <Grid item md={3}>
            <div className={styles.control}>
              <div className={styles.profile}>
                <Avatar variant="rounded">
                  <SupervisorAccountIcon color="primary" />
                </Avatar>
              </div>
              <div
                className={classNames(
                  styles.questions,
                  history.location.pathname === "/questions"
                    ? styles.selected
                    : null
                )}
                onClick={() => history.push("/questions")}
              >
                <QuestionAnswerIcon />
                <h3>Questions</h3>
              </div>
              <div
                className={classNames(
                  styles.syllabus,
                  history.location.pathname === "/syllabus"
                    ? styles.selected
                    : null
                )}
                onClick={() => history.push("/syllabus")}
              >
                <ImportContactsIcon />
                <h3>Syllabus</h3>
              </div>
              <div
                className={classNames(
                  styles.data,
                  history.location.pathname === "/data" ? styles.selected : null
                )}
                onClick={() => history.push("/data")}
              >
                <StorageIcon />
                <h3>Data</h3>
              </div>
              <div className={styles.tools}>
                <p>Tools</p>
                <div className={styles.settings}>
                  <Settings />
                  <h3>Settings</h3>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item md={9}>
            <div className={styles.details}>
              <CurrentComponent />
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(Home);

const QuestionsComponent = () => {
  const {
    questions,
    setQuestions,
    saveQuestionToDB,
    deleteQuestionFromDB,
    announcements,
    setAnnouncements,
    saveAnnouncementToDB,
    deleteAnnouncementFromDB,
  } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [qid, setQid] = useState(null);
  const [Anopen, setAnOpen] = useState(false);
  const [aid, setAid] = useState(null);

  const getWidth = (index, i) => {
    const total =
      questions[index].option1.count + questions[index].option2.count;
    const count =
      i === 1 ? questions[index].option1.count : questions[index].option2.count;

    return total ? (count / total) * 100 : 0;
  };

  const onClickDelete = (id) => {
    setOpen(true);
    setQid(id);
  };

  const onClickDeleteAnn = (id) => {
    setAnOpen(true);
    setAid(id);
  };

  const DeleteAnnouncement = () => {
    deleteAnnouncementFromDB(qid).then(() => {
      setAnnouncements(announcements.filter((ann) => ann.id !== aid));
    });
    setAid(null);
  };

  const DeleteQuestion = () => {
    deleteQuestionFromDB(qid).then(() => {
      setQuestions(questions.filter((question) => question.id !== qid));
    });
    setQid(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeDialogAnnDel = () => {
    setAnOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //Add Question and Announcement

  const [qOpen, setQopen] = useState(false);

  const closeDialog = () => {
    setQopen(false);
  };

  const AddQuestion = () => {
    handleCloseMenu();
    setQopen(true);
  };

  const AddQuestionToDb = () => {};

  const ContentForAddQuestion = () => {
    const [questiontoAdd, setQuestionToAdd] = useState("");
    const [option1, setOption1] = useState("option1");
    const [option2, setOption2] = useState("option2");
    const [answer, setAnswer] = useState(option1);

    const getID = () => {
      let tempId = [];

      if (!questions.some((question) => question.id === "story1"))
        tempId.push(1);
      if (!questions.some((question) => question.id === "story2"))
        tempId.push(2);
      if (!questions.some((question) => question.id === "story3"))
        tempId.push(3);

      if (tempId.length === 1) {
        return tempId[0];
      } else {
        let lowest = tempId[0];
        for (let i in tempId) {
          if (tempId[i] <= lowest) lowest = tempId[i];
        }
        return lowest;
      }
    };

    const onSubmit = (e) => {
      e.preventDefault();
      setQuestions([data, ...questions]);
      saveQuestionToDB(data, `story${getID()}`);
      closeDialog();
    };

    const data = {
      question: questiontoAdd,
      option1: {
        value: option1,
        count: 0,
      },
      option2: {
        value: option2,
        count: 0,
      },
      answer,
    };

    return (
      <form onSubmit={onSubmit} className={styles.addQuestionForm}>
        <TextField
          required
          className={styles.inputField}
          type="text"
          size="small"
          value={questiontoAdd}
          onChange={(e) => {
            setQuestionToAdd(e.target.value);
          }}
          variant="filled"
          label="Question"
        />
        <FormControl className={styles.fullWidth} component="fieldset">
          <p>Selected option will be considered as answer</p>
          <RadioGroup
            aria-label="options"
            name="options"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          >
            <div className={styles.optionInput}>
              <Radio required className={styles.radioBtn} value={option1} />
              <input
                className={styles.inputField}
                type="text"
                size="small"
                // value={option1}
                onChange={(e) => {
                  setOption1(e.target.value);
                }}
                variant="standard"
                placeholder="Enter Option 1"
              />
            </div>
            <div className={styles.optionInput}>
              <Radio required className={styles.radioBtn} value={option2} />
              <input
                className={styles.inputField}
                type="text"
                size="small"
                // value={option2}
                onChange={(e) => {
                  setOption2(e.target.value);
                }}
                variant="standard"
                placeholder="Enter Option 2"
              />
            </div>
          </RadioGroup>
        </FormControl>
        <div className={styles.actionBtn}>
          <Button
            className={styles.action}
            onClick={closeDialog}
            variant="text"
          >
            Cancel
          </Button>
          <Button type="submit" className={styles.action} variant="text">
            Submit
          </Button>
        </div>
      </form>
    );
  };

  //

  // Announcement
  const AddAnnouncement = () => {
    handleCloseMenu();
    setAopen(true);
  };

  const [aOpen, setAopen] = useState(false);

  const closeDialogAnn = () => {
    setAopen(false);
  };

  const ContentForAddAnnouncement = () => {
    const [announcement, setAnnouncement] = useState("");

    const getID = () => {
      let tempId = [];

      if (!announcements.some((ann) => ann.id === "an1")) tempId.push(1);
      if (!announcements.some((ann) => ann.id === "an2")) tempId.push(2);

      if (tempId.length === 1) {
        return tempId[0];
      } else {
        let lowest = tempId[0];
        for (let i in tempId) {
          if (tempId[i] <= lowest) lowest = tempId[i];
        }
        return lowest;
      }
    };

    const onSubmit = (e) => {
      e.preventDefault();
      saveAnnouncementToDB(announcement, `an${getID()}`);
      setAnnouncements([announcement, ...announcements]);
      closeDialog();
    };

    return (
      <form onSubmit={onSubmit} className={styles.addQuestionForm}>
        <TextareaAutosize
          required
          className={styles.inputFieldTextArea}
          type="text"
          value={announcement}
          rowsMin={3}
          onChange={(e) => {
            setAnnouncement(e.target.value);
          }}
          placeholder="Enter Announcement"
        />
        <div className={styles.actionBtn}>
          <Button
            className={styles.action}
            onClick={closeDialogAnn}
            variant="text"
          >
            Cancel
          </Button>
          <Button type="submit" className={styles.action} variant="text">
            Submit
          </Button>
        </div>
      </form>
    );
  };

  //

  const WhichDialog = ({ which }) => {
    switch (which) {
      case "deleteQuestion":
        return (
          <DialogComponent
            open={open}
            handleClose={handleClose}
            title={"Are you sure you wish to delete the question ?"}
            content={null}
            negative={"No"}
            positive={"Yes, Delete"}
            trigger={DeleteQuestion}
          />
        );
      case "addQuestion":
        return (
          <DialogComponent
            title="Add Question"
            negative={null}
            positive={null}
            trigger={AddQuestionToDb}
            open={qOpen}
            handleClose={closeDialog}
            content={null}
            component={ContentForAddQuestion}
          />
        );
      case "addAnnouncement":
        return (
          <DialogComponent
            title="Add Announcement"
            negative={null}
            positive={null}
            trigger={AddQuestionToDb}
            open={aOpen}
            handleClose={closeDialogAnn}
            content={null}
            component={ContentForAddAnnouncement}
          />
        );
      case "deleteAnnouncement":
        return (
          <DialogComponent
            open={Anopen}
            title="Are you sure you wish to delete the Announcement"
            content={null}
            negative={"No"}
            positive={"Yes, Delete"}
            trigger={DeleteAnnouncement}
            handleClose={closeDialogAnnDel}
          />
        );

      default:
        break;
    }
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.topbar}>
        <Tooltip placement="top" title="Add">
          <IconButton onClick={handleClick}>
            <AddCircle />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={AddQuestion}>Question</MenuItem>
          <MenuItem onClick={AddAnnouncement}>Announcement</MenuItem>
        </Menu>
      </div>
      <div className={styles.questionDetails}>
        {!questions || !questions.length ? (
          <div className={styles.noData}>
            <p>Oops! Seems like you haven't added anything yet :(</p>
          </div>
        ) : (
          <Grid container>
            <p className={styles.heading}>Stories</p>

            <Grid item md={12}>
              <Grid container spacing={4}>
                {questions.map((question, index) => {
                  return (
                    <Grid key={index} item xl={4} lg={4} md={6} sm={12} s={12}>
                      <Card className={styles.questionCard}>
                        <h4>{question.question}</h4>
                        <div className={styles.options}>
                          <div className={styles.option}>
                            <div
                              className={styles.votingBar}
                              style={{ width: `${getWidth(index, 1)}%` }}
                            ></div>
                            <p>{question.option1.value}</p>
                            <p>{question.option1.count}</p>
                          </div>
                          <div className={styles.option}>
                            <div
                              className={styles.votingBar}
                              style={{ width: `${getWidth(index, 2)}%` }}
                            ></div>
                            <p>{question.option2.value}</p>
                            <p>{question.option2.count}</p>
                          </div>
                        </div>
                        <h5>{question.answer}</h5>
                        <Tooltip placement="bottom" title="Delete Question">
                          <IconButton
                            onClick={() => onClickDelete(question.id)}
                            className={styles.deleteBtn}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              <Grid item md={12}>
                <p className={styles.heading}>Announcements</p>
                <Grid container spacing={4}>
                  {announcements.map((ann) => {
                    return (
                      <Grid key={ann.id} item md={4}>
                        <Card
                          className={classNames(
                            styles.questionCard,
                            styles.announcement
                          )}
                        >
                          <h2>{ann.msg}</h2>
                          <Tooltip
                            placement="bottom"
                            title="Delete Announcement"
                          >
                            <IconButton
                              onClick={() => onClickDeleteAnn(ann.id)}
                              className={styles.deleteBtn}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>

      <WhichDialog which={"deleteQuestion"} />
      <WhichDialog which={"deleteAnnouncement"} />
      <WhichDialog which={"addQuestion"} />
      <WhichDialog which={"addAnnouncement"} />
    </div>
  );
};

// const SyllabusComponent = () => {
//   return <div>Hello Syllabus</div>;
// };

// const DataComponent = () => {
//   return <div>Hello Data</div>;
// };

const DialogComponent = ({
  open,
  handleClose,
  title,
  content,
  component: ContentComponent,
  positive,
  negative,
  trigger,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={styles.dialogTitle} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent className={styles.content}>
        {ContentComponent ? <ContentComponent /> : content}
      </DialogContent>
      {positive || negative ? (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {negative}
          </Button>
          <Button
            onClick={() => {
              handleClose();
              trigger();
            }}
            color="primary"
            autoFocus
          >
            {positive}
          </Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
};