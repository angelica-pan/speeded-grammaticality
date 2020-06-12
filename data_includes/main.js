PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar


////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
AddTable( "mytable" ,
    "exp,item,sentence,question,answer_F,answer_J\n"+
    "test,1,According to the story Mary was found by John and then Peter was too., sample question,yes, no\n"+
    "test,2,Another test sentence,another question,left,right\n"+
    "vpe,1,The cat that is chasing the mouse runs fast,,,\n"+
    "vpe,2,The mouse that the cat is chasing runs fast,,,"
)


Template("mytable" , variable => 
    newTrial(
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
        newController("dash", "DashedSentence", {s:variable.sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":500})
            .cssContainer({"width":"600px", "height":"300px", "position":"absolute", "top":"50%", "left":"50%", "margin":"-150px 0 0 -300px", "font-size": "150%",})
            .log()
            .print()
            .wait()
            .remove()
        ,
        // Grammaticality Judgment
        newText("placeholder", "+++++++")
        .cssContainer({"width": "600px", "height": "50px","font-size": "150%",})
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
        newCanvas("judgment", 600, 300)
            .add(0, 145, getText("placeholder"))
            .add(0, 200, getText("not_okay"))
            .add(300, 200, getText("okay"))
            .print()
            .log()
        ,
        newKey("grammaticality", "FJ")
            .wait()
            .log()
        ,
        clear()
        // Comprehension question
        ,
        (variable.question?[newText("question", variable.question)
            .cssContainer({"width": "600px", "height": "50px", "font-size": "150%",})
        ,
        newText("answer_F", variable.answer_F)
            .before(newText("F)&nbsp;"))
            .cssContainer({"width": "300px"})
        ,
        newText("answer_J", variable.answer_J)
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
)
.log("exp", variable.group)
.log("item", variable.group)

// Send results
// PennController.SendResults("send");
