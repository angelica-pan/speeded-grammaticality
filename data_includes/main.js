PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar


////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
AddTable( "mytable" ,
    "exp,item,sentence\n"+
    "test,1,According to the story Mary was found by John, and then Peter was too.\n"+
    "test,2,Another test sentence\n"+
    "vpe,1,The cat that is chasing the mouse runs fast\n"+
    "vpe,2,The mouse that the cat is chasing runs fast"
)

Template("mytable" , variable => 
    newTrial(
        defaultText
            .center()
        ,
        newButton("Start reading")
            .print()
            .wait()
            .remove()
        ,
        newController("DashedSentence", {s:variable.sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":200})
            .print()
            .log()
            .wait()
            .remove()
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
    )
)
.log("exp", variable.group)
.log("item", variable.group)

// Send results
// PennController.SendResults("send");
