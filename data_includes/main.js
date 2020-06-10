PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////

newButton("Start reading")
    .print()
    .wait()
    .remove()
,
newController("DashedSentence", {s:"this is a test", "mode":"speeded acceptability", "display":"in place", "wordTime":200})
    .print()
    .log()
    .wait()
    .remove()
,
newText("Good job!")
    .print()
// Send results
// PennController.SendResults("send");
