PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar


////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
AddTable( "mytable" ,
    "Type,Condition,Sentence\n"+
    "Test,A,The cat that is chasing the mouse runs fast\n"+
    "Test,B,The mouse that the cat is chasing runs fast"
)

Template("mytable" , variable => 
    newTrial(
        newButton("Start reading")
            .print()
            .wait()
            .remove()
        ,
        newController("DashedSentence", {s:variable.Sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":200})
            .print()
            .log()
            .wait()
            .remove()
        ,
        newButton("Next")
            .print()
            .wait()
            .remove()
    )
)


// Send results
// PennController.SendResults("send");
