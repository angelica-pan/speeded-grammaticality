PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////

Sequence("intro", "trial", "send")
////////////////////////////////////////////////////////////////////////////////

customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait()
        
// Post-practice items
newTrial("intro",
    newText("done", "sample text")
        .center()
        .bold()
        .css({"width": "300px"})
    ,
    newCanvas(300, 190)
        .add(0, 150, getText("done"))
        .print()
    ,
    customButton("Click here to start the experiment")
)

newController("trial", "DashedSentence", {s:"this is a test", "mode":"speeded acceptability", "display":"in place", "wordTime":200})
    .print()
    .log()
    .wait()
    .remove()

// Send results
PennController.SendResults("send");
