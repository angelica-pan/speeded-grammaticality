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

newTrial(
	newButton("Start reading")
        .print()
        .wait()
        .remove()
    ,
    newController("DashedSentence", {s: "The mouse that the cat that the dog is petting is hugging is happy"} )
        .print()
        .log()
        .wait()
        .remove()
)

Template("mytable" , variable => 
    newTrial(
        defaultText
            .center()
        ,
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
        // newController("dash", "DashedSentence", {s:variable.sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":200})
        //     .print()
        //     .log()
        //     .wait()
        //     .remove()
        // ,
        newCanvas("s_display", 300, 300)
            .add(0, 145, getController("dash"))
            .log()
            .print()
        ,
        clear()
        ,
        newText("judgment", "text here")
        .cssContainer({"width": "600px", "font-size": "150%", "height": "50px"})
        ,
        // F for not okay, J for okay
        newText("F", "press F for not okay")
            .italic()
            .cssContainer({"width": "300px"})
        ,
        newText("J", "press J for okay")
            .italic()
            .cssContainer({"width": "300px"})
        ,
        newCanvas("q_display", 600, 300)
            .add(0, 145, getText("judgment"))
            .add(0, 200, getText("F"))
            .add(300, 200, getText("J"))
            .print()
            .log()
        ,
        newKey("grammaticality", "FJ")
            .wait()
            .log()
        ,
        clear()
        ,
        (variable.question?[newText("question", variable.question)
            .cssContainer({"width": "600px", "font-size": "150%", "height": "50px"})
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
