//
// Speeded grammaticality judgment experiment (with time out)
//
// Trial format:
// 1. Rest screen (participant presses the spacebar to continue)
// 2. Stimulus RSVP 
// 3a. Judgment (participant presses F or J to indicate judgment)
// 3b. Time out (skips to next section/trial if participant does not provide judgment within time frame)
		// Version 0: no time out (participants have as much time as they want to provide judgment)
			// Comment out lines 193-205
		// Version 1: ["tooSlow"] message prints before next section begins 
			// Comment out lines 201-202
			// i.e. print comprehension question if there is one
		// Version 2: next trial begins immediately 
			// Comment out lines 198-201
			// i.e. skip comprehension question even if there is one
		// Version 3: ["tooSlow"] message prints before next trial begins 
			// Don't comment out anything
			// i.e. skip comprehension question even if there is one
// 4. Comprehension question (participant presses F or J to answer comprehension question)
// 5. Feedback (participant sees feedback and presses Spacebar to continue)
// 6. Break trial (participant has opportunity to take longer break and sees comprehension question accuracy)
//
// Sections 4 and 5 only display when the source CSV has non-empty [question] and [feedback] values


// CSV must have the following column(s): [sentence]
// CSV should have the following column(s): [question], [F_answer], [J_answer], [feedback] 
// CSV should have the following column(s) for logging: [group], [condition], [item], [correct_judgment], [correct_answer]

// Angelica Pan, June 2020

////////////////////////////////////////////////////////////////////////////////

PennController.ResetPrefix(null);                       // Initiates PennController
PennController.DebugOff()								// Comment out this line to show the debug window
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////

// Custom button: creates button with blue background
customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait()


// source: https://www.pcibex.net/forums/topic/catch-trials/#post-5643
// [sepWithN("break", trial_sequence, n)] -- inserts ["break"] trial into [trial_sequence] every [n] instances
function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

// Test sequence
// Sequence("practice")

// Experimental sequence
Sequence("welcome", "practice", "post-practice", sepWithN("break", rshuffle("test_vpe", "test_good-fillers", "test_bad-fillers"), 5), "end", "send", "confirmation")

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
customTrial = label => variable => newTrial( label ,
	// Create [score] and [outOf] variables and initialize to 0, if they do not already exist
	newVar("score", 0).global()
	,
	newVar("outOf", 0).global()
	,
	// Set text to always be centered
    defaultText
        .center()
    ,
    // 1. Rest screen 
    	// Participant presses the spacebar to continue.
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
    // 2. Stimulus RSVP
    	// Prints value in source table's [sentence] column at 150%.
    	// margin: top=110px right=0px bottom=0px left=0px
    newController("dash", "DashedSentence", {s:variable.sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":200})
        .cssContainer({"margin":"110px 0 0 0", "font-size": "150%",})
        .log()
        .print()
        .wait()
        .remove()
    ,
    // 3a. Judgment
        // Prints ["placeholder"] at 150%. Below that, prints ["not_okay"] on the left and ["okay"] on the right.
    	// Participant presses F/J to make a judgment and continue. 
    newText("placeholder", "+++++++")
        .cssContainer({"width": "600px", "height": "50px","font-size": "150%"})
    ,
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
    newKey("judgment", "FJ")				
    	.callback(getTimer("window").stop())
    	.log("all")							
    ,
    // 3b. Trial time out
    	// Starts a [2000]ms timer that stops (a) when a valid "judgment" key is pressed, or (b) when it runs out.
    	// Then, checks if a valid "judgment" key was pressed. If yes, print nothing (aka continue). If no, end trial.
	newTimer("window", 2000)
    	.log()
        .start()
        .wait("first")
    ,
    newText("tooSlow", "Please answer more quickly! Remember, speed is important.")
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
    ,
    newText("next", "Press the spacebar to continue.")
    	.italic()
    	.cssContainer({"margin":"105px 0 0 0", "width":"600px"})
    ,
    clear()
//     ,
// 	getKey("judgment")
//     	.test.pressed()
//     	.success(newText(" ").print())
//     	.failure(
//     		getText("tooSlow").print(),
//     		getText("next").print(),
//     		getKey("continue").wait()
//     		,			
//     		end()
//     		)
// 	,
// 	clear()
	,
	// 4. Comprehension question 
    (variable.question?[
    newText("question", variable.question)
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
    getKey("judgment")		// disable "judgment" Key so that any ["answer"] keypress is not incorrectly logged as ["judgment"]
    	.disable()
    ,
    newKey("answer", "FJ")
        .log()
        .callback(
			getKey("answer")
				.test.pressed(variable.correct_answer)
				// Increment [score] variable every time a question is answered correctly
				.success(getVar("score").set(v=>v+1))
			,
			// Increment [outOf] variable every time a question is answered
			getVar("outOf").set(v=>v+1)
		)
		.wait()
    ]:null)
    ,
    clear()
    // 5. Feedback 
    ,
    (variable.feedback?[
    newText(variable.feedback)
    	.bold()
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
		.print()
	,
	getText("next").print()
	,
    getKey("continue").wait()
    ]:null)
)
.log("group",               	variable.group)
.log("condition",           	variable.condition)
.log("item",                	variable.item)
.log("correct_judgment",    	variable.correct_judgment)
.log("correct_answer",    	    variable.correct_answer)

// 6. Break trial
	// Participant presses the spacebar to see comprehension question accuracy.
	// Comprehension question accuracy is displayed. 
	// Participant presses the spacebar to continue to more experimental trials.				
newTrial("break",
	newVar("score").global()
	,
	newVar("outOf").global()
	,
	defaultText
		.center()
	,
	newText("pt1", "Time for a longer break!")
		.cssContainer({"margin":"145px 0 0 0", "width":"600px", "font-size":"150%"})
		.bold()
		.print()
	,
	newText("pt2", "Press the spacebar to see comprehension question accuracy.")
		.cssContainer({"margin":"105px 0 0 0", "width":"600px"})
		.italic()
		.print()
	,
	newKey(" ")
		.wait()
	,
	getText("pt1").remove()
	,
	getText("pt2").remove()
	,
	// Prints comprehension question accuracy as fraction
		// margin: top=145px right=0px bottom=50px left=0px
	newText("accuracy", "Current comprehension question accuracy: ")
		.cssContainer({"margin":"145px 0 50 0", "width":"600px"})
		.after(newText("").text(getVar("score")))
   		.after(newText("/"))
		.after(newText("").text(getVar("outOf")))
		.print()
	,
	customButton("Click here to continue")
	,
	// Reset [score] and [outOf] variables to 0
	getVar("score").set(v=>0)
	,
	getVar("outOf").set(v=>0)
)

// Items
Template("practice.csv",            customTrial("practice"))
Template("test_bad-fillers.csv",    customTrial("test_bad-fillers"))
Template("test_good-fillers.csv",   customTrial("test_good-fillers"))
Template("test_vpe.csv",            customTrial("test_vpe"))

// Post-experiment comment section
newTrial("end",
	newHtml("comments", "comments.html")
		.log()
		.settings.cssContainer({"width": "720px"})
		.print()
	,
    customButton("Click here to continue")
    ,
    clear()
    ,
    newHtml("exit_form", "exit.html")
        .log()
        .settings.cssContainer({"width": "720px"})
        .inputWarning("Please enter your name and create a unique identifier.")
        .print()
    ,
    newButton("Click here to finish the experiment.")
        .css({"background-color":"lightblue", "font-size": "150%", "font-weight": "bold"})
        .size(500,50)
        .center()
        .print()
        .wait(
            getHtml("exit_form").test.complete()
            .failure(getHtml("exit_form").warn() )
        )
)

// Send results
PennController.SendResults("send");

// End-of-experiment confirmation
newTrial("confirmation",
    newText("Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)


