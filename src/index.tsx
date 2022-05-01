 
/*  Answers, Terence
 
Please detail what is wrong with the below code, and why.
Also where applicable, mention what you would do differently.
 
As a general suggestion, if any of the codebase uses react hooks,
or if it's a new codebase, I would recommend this component be
converted to react hooks functions because of the improved readability
and reusability of the code hooks’ offers. As a bonus, that would
solve the 5 lines of code that would need to be added for
binding the functions to this class properties.
Otherwise, if hooks are not an option, the approach of a class
component is still valid because the child components and methods
within the class are tightly coupled to the Stopwatch component as
a whole 
 
The rest of the code suggestions I’ve put inline and with the
component remaining as a class component.*/
 
 
import * as React from "react";
import ReactDOM from 'react-dom/client';
 
 
import { Component, ClassAttributes } from "react";
const formattedSeconds = (sec: number) =>
 Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);
 
interface StopwatchProps extends ClassAttributes<Stopwatch> {
 initialSeconds: number;
 laps: number[];
}
 
/* Add a StopwatchState interface to help with readability
and type checking of state properties. Add isTicking and laps to
state */
interface StopwatchState {
 secondsElapsed: number;
 isTicking: boolean;
 laps: number[];
}
 
class Stopwatch extends Component<StopwatchProps, StopwatchState> {
 incrementer: any
 
 constructor(props: StopwatchProps) {
   super(props);
   /* Include isTicking as a state variable, reasoning is described
   below in the render method. This allows us to remove the lastClearedIncrementer
   property too. Also add laps to state, because it is data that varies in
   relation to the state of the component */
 
   this.state = {
     secondsElapsed: props.initialSeconds,
     isTicking: false,
     laps: []
   }
   /* Remove initialise laps here as it is now in state 
 
   Bind methods to class (this) to give methods access to class scope
   This allows these functions to work as intended */
   this.handleStartClick = this.handleStartClick.bind(this);
   this.handleStopClick = this.handleStopClick.bind(this);
   this.handleResetClick = this.handleResetClick.bind(this);
   this.handleLapClick = this.handleLapClick.bind(this);
   this.handleDeleteClick = this.handleDeleteClick.bind(this);
 }
 
 handleStartClick() {
   /* isTicking state only need be set on start click */
   this.setState({
     isTicking: true
   });
 
   this.incrementer = setInterval( () => {
     const secondsElapsed = this.state.secondsElapsed + 1;
     this.setState({
       secondsElapsed
     })}, 1000);
 
 }
 
 handleStopClick() {
   clearInterval(this.incrementer);
   /* isTicking set to false */
 
   this.setState({
     isTicking: false
   });
 }
 
 handleResetClick() {
   clearInterval(this.incrementer);
   /* Fix the syntax by replacing , with ;
   add laps to state variable and reset */
   this.setState({
     laps: [],
     secondsElapsed: 0
   });
 }
 
 // Fix typo of lab > lap
 handleLapClick() {
   /* Ensure state isn't mutated directly by unpacking this.state.laps,
   concat with secondsElapsed */
   const laps = [...this.state.laps].concat([this.state.secondsElapsed]);
   this.setState({
     laps
   });
 }
 
 handleDeleteClick(index:number) {
   /* Ensure state isn't mutated directly by unpacking this.state.laps,
  remove deleted index using splice at index */
   const laps = [...this.state.laps];
   laps.splice(index, 1);
   this.setState({
     laps
   });
 }
 
 render() {
   /* Adding and fetching isTicking from state allows us to remove the
   lastClearedIncrementer property. */
   const {
     secondsElapsed,
     isTicking,
     laps,
   } = this.state;
 
   /* For readability, suggest using consts to make conditions
  descriptive yet summarised, ‘timerAtZero’ */
 
   const timerAtZero = (secondsElapsed === 0);
 
   /*   For readability, can refactor conditions to include <button>lap</button> render
   as part of <button>stop</button> render because (!timerAtZero && !resetted) is
   logically equivalent to !(timerAtZero || resetted).
 
   However, to handle the case where the intialSeconds has not been defined as 0,
   using a 'isTicking' state variable is more readable and provides logic to display
   start or stop buttons. It's more reflective of the components logic too.
 
   
 
   Add bespoke <Laps> component with props to include laps from Stopwatch state to ensure
   only children components are updated when Lap changes, and not entire stopwatch
   component (which causes an infinite loop) */
 
   return (
     <div className="stopwatch">
       <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
       {(!isTicking ? <button type="button" className="start-btn"
         onClick={this.handleStartClick}>start</button>
         : <><button type="button" className="stop-btn"
           onClick={this.handleStopClick}>stop</button>
           <button id='btnLap' type="button" onClick={this.handleLapClick}>lap</button>
           </>
       )}
         {(!timerAtZero && !isTicking ? <button type="button" onClick={this.handleResetClick}>reset</button> : null)}
       <Laps laps={laps} deleteHandler={this.handleDeleteClick} />
     </div>
   );
 }}
 
/* Add type onDeleteHandler for readability.*/
type onDeleteHandler = (i:number) => void;
 
/* Add key prop to outermost parent component Lap for react internal referencing */
 
const Laps = (props: { laps: number[], deleteHandler: onDeleteHandler } ) => (
 <div className="stopwatch-laps">
   {props.laps && props.laps.map((lap: number, i: number) =>
     <Lap key={i} index={i + 1} lap={lap} lapDeleteHandler={props.deleteHandler}  />)
   }
 </div>
);
 
const Lap = (props: { index: number, lap: number, lapDeleteHandler: onDeleteHandler } ) =>
 (<div key={props.index} className="stopwatch-lap">
   <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}
   <button onClick={() => props.lapDeleteHandler( props.index - 1 )} > X </button>
</div>
);
 
const root = ReactDOM.createRoot(
 document.getElementById('root') as HTMLElement
);
root.render(
 <React.StrictMode>
   <Stopwatch initialSeconds={1} laps={[]} />
 </React.StrictMode>
);
