PennController.ResetPrefix(null);                       // Initiates PennController
// PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////

//Sequence("welcome", "practice", "post-practice", shuffle(randomize("test_bad-fillers"), randomize("test_good-fillers"), randomize("test_vpe")), "send", "confirmation")
Sequence("practice")

////////////////////////////////////////////////////////////////////////////////

// Custom button: creates button with blue background
customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait()

////////////////////////////////////////////////////////////////////////////////

// Welcome/instructions
newTrial("welcome",
    newHtml("welcome", "welcome.html")
        .settings.cssContainer({"width": "720px"})
        .print()
    ,
    newText("next", "Press the spacebar to continue.")
        .italic()
        .center()
        .print()
    ,
    newKey(" ")
        .wait()
    ,
    clear()
    ,
    newHtml("instructions", "instructions.html")
        .settings.cssContainer({"width": "720px"})
        .print()
    ,
    customButton("Click here to continue")
)

// Post-practice items
newTrial("post-practice",
    newHtml("post-practice", "post-practice.html")
        .settings.cssContainer({"width": "600px"})
        .print()
    ,
    customButton("Click here to start the experiment")
)

// Trial template
// source CSV must have the following columns: [sentence]
// source CSV can have the following columns: [question], [F_answer], [J_answer], [feedback] 
// source CSV should have the following columns (for logging): [group], [condition], [item], [correct_judgment], [correct_answer]
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
        .cssContainer({"margin":"110px 0 0 0", "font-size": "150%",})
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
    newCanvas("j_display", 600, 400)
        .add(0, 145, getText("placeholder"))
        .add(0, 350, getText("not_okay"))
        .add(300, 350, getText("okay"))
        .print()
        .log()
    ,
    // Create [3000]ms timer. If participant presses F/J key while timer is still running, continue. 
    // Otherwise, display newText("tooSlow")
    newTimer("window", 3000)
    	.log()
        .start()
    ,
    newKey("judgment", "FJ")
    	.log()
    	.wait()
    ,
    newText("tooSlow", "Too slow...")
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
    ,
    newText("next", "Press the spacebar to continue.")
    	.italic()
    	.cssContainer({"margin":"350px 0 0 0", "width":"600px"})
    ,
    clear()
	,
    getTimer("window")
    	.test.running()
    	.failure(
    		getText("tooSlow").print(),
    		getText("next").print(),
    		getKey("continue").wait(),
    		clear()
    	)
	,
    // Comprehension question (only displays if value in source CSV's [question] column is non-empty)
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
    newCanvas("q_display", 600, 400)
        .add(0, 145, getText("question"))
        .add(0, 200, getText("F_answer"))
        .add(300, 200, getText("J_answer"))
        .add(0, 350, getText("reminder"))
        .print()
        .log()
    ,
    newKey("answer", "FJ")
        .wait()
        .log()
    ]:null)
    ,
    clear()
    // Feedback (only displays if value in source CSV's [feedback] column is non-empty)
    ,
    (variable.feedback?[newText(variable.feedback)
    	.bold()
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
		.print()
	,
	getText("next").print()
	,
    newKey(" ")
        .wait()
    ]:null)
)
.log("group",               	variable.group)
.log("condition",           	variable.condition)
.log("item",                	variable.item)
.log("correct_judgment",    	variable.correct_judgment)
.log("correct_answer",    	    variable.correct_answer)

// test items
Template("practice.csv",            customTrial("practice"))
Template("test_bad-fillers.csv",    customTrial("test_bad-fillers"))
Template("test_good-fillers.csv",   customTrial("test_good-fillers"))
Template("test_vpe.csv",            customTrial("test_vpe"))

// End of experiment confirmation
newTrial("confirmation",
    newText("Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)

// Send results
PennController.SendResults("send");
