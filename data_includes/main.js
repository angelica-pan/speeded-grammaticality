PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////

Sequence(shuffle(randomize("test_bad-fillers"), randomize("test_good-fillers"), randomize("test_vpe")), "send")

////////////////////////////////////////////////////////////////////////////////

// source .csv must have the following columns:
	// "sentence", "question", "F_answer", "J_answer"
// source .csv should have the following columns:
	// "group", "condition", "item", "judgment", "correct_answer"
customTrial = label => variable => newTrial( label ,
    defaultText
        .center()
    ,
    // Rest screen in between trials (press space to continue)
    newImage("fixation_cross", "fixation_cross.png")
        .size(300,300)
    ,
    newCanvas(300, 310)
        .add(0, 10, getImage("fixation_cross"))
        .print()
    ,
    newKey("continue", " ")
        .wait()
    ,
    clear()
    ,
    // RSVP sentence
    newController("dash", "DashedSentence", {s:variable.sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":200})
        .cssContainer({"width":"600px", "height":"300px", "margin":"145px 0 0 300px", "font-size": "150%",})
        .log()
        .print()
        .wait()
        .remove()
    ,
    // Grammaticality Judgment
    newText("placeholder", "+++++++")
    .cssContainer({"width": "600px", "height": "50px","font-size": "150%"})
    ,
    // F for not okay, J for okay
    newText("not_okay", "F)&nbsp; NOT OKAY")
        .italic()
        .cssContainer({"width": "300px"})
    ,
    newText("okay", "J)&nbsp; OKAY")
        .italic()
        .cssContainer({"width": "300px"})
    ,
    newCanvas("j_display", 600, 300)
        .add(0, 145, getText("placeholder"))
        .add(0, 200, getText("not_okay"))
        .add(300, 200, getText("okay"))
        .print()
        .log()
    ,
    newKey("judgment", "FJ")
        .wait()
        .log()
    ,
    clear()
    // Comprehension question
    ,
    (variable.question?[newText("question", variable.question)
        .cssContainer({"width": "600px", "height": "50px", "font-size": "150%"})
    ,
    newText("F_answer", variable.F_answer)
        .before(newText("F)&nbsp;"))
        .cssContainer({"width": "300px"})
    ,
    newText("J_answer", variable.J_answer)
        .before(newText("J)&nbsp;"))
        .cssContainer({"width": "300px"})
    ,
    newText("reminder", "Press the F or J key to select your answer")
        .italic()
        .cssContainer({"width": "600px"})
    ,
    newCanvas("q_display", 600, 300)
        .add(0, 145, getText("question"))
        .add(0, 200, getText("answer_F"))
        .add(300, 200, getText("answer_J"))
        .add(0, 250, getText("reminder"))
        .print()
        .log()
    ,
    newKey("q_response", "FJ")
        .wait()
        .log()
    ]:null)
)
.log("group",               variable.group)
.log("condition",           variable.condition)
.log("item",                variable.item)
.log("judgment",    	    variable.judgment)
.log("FJ_correct",    	    variable.correct_answer)

// test items
Template("test_bad-fillers.csv",    customTrial("test_bad-fillers"))
Template("test_good-fillers.csv",    customTrial("test_good-fillers"))
Template("test_vpe.csv",        customTrial("test_vpe"))

// Send results
PennController.SendResults("send");
