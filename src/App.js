import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Container, Row, Col } from 'reactstrap';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';

const paperStyle = 
{
  height: 200,
  padding: 40,
  textAlign: 'center',
  display: 'inline-block',
};

const Buttn = (props)=>(
	<MuiThemeProvider>
	<RaisedButton 
  	label={props.text}
		onClick={props.click}
		secondary={props.secondary}
		/>
	</MuiThemeProvider>
)

const Fbuttn = (props)=>(
	<MuiThemeProvider>
	<FloatingActionButton
		mini={true}
		secondary={props.n?true:false}
		onClick={props.click}>
		{
			props.n
				?<ContentRemove />
				:<ContentAdd />
		}

	</FloatingActionButton>
	</MuiThemeProvider>
)

const Toggl = props=>(
<MuiThemeProvider>
	<Toggle
  label={props.label}
  labelPosition="right"
 	onToggle={props.toggle}
	toggled={props.toggled}
	disabled={props.able} 
	/>
</MuiThemeProvider>
)

const papr = (props)=>(
	<MuiThemeProvider>
    <Paper
		style={props.style}
		children={props.content}
		/>
  </MuiThemeProvider>
)


class PomoContent extends Component
{
	render()
	{
		let clock = this.props.clock
		let work = 
		{
			background:clock.workRest?"#356":'white',
			minHeight:'200px'
		}
		let rest = 
		{
			background:!clock.workRest?"green":'white',
			minHeight:'200px'
		}
		let addReduce=which=>{
			return (
				<Row>
					<Col md={6}>
						<Fbuttn click={this.props.addTime.bind(this,which)}/>
					</Col>
					<Col md={6}>
						<Fbuttn n={true}click={this.props.reduceTime.bind(this,which)}/>
					</Col>
				</Row>
			)
		}
		let smNum = {
  		position: 'absolute',
  		right: '0',
  		color: 'red'
		}
		let started = this.props.clock.started
		let miniNum=which=>{
			let wr = which.slice(0,1)
			return clock[wr]!==clock[which]?<Col md={2} style={smNum}>{minsecs(clock[wr])}</Col>:''
		}
		return <Col lg={12}>
				<Row style={{height:'100px'}}>	
					<Col sm={6}>
					{miniNum('work')}
					<h1>{minsecs(started?clock.w:clock.work)}</h1>
					{clock.workRest
					?addReduce('work')	
					:''}
					</Col>
					<Col sm={6}>
					{miniNum('rest')}
					<h1>{minsecs(started?clock.r:clock.rest)}</h1>
					{!clock.workRest
					?addReduce('rest')
					:''}</Col>
				</Row>
		</Col>
	}
}

class Pomo extends Component
{
	constructor(props)
	{
		let newClock = newPomo(props.id)
		super(props)
		this.state=newClock
		this.switchPomo = this.switchPomo.bind(this)
	}
	switchPomo()
	{
		this.setState({
			workRest:!this.state.workRest
		})
	}

	componentWillUnmount()
	{
		if(this.stopTimer)
		{
		this.stopPomo()
		}
	}

	startPomo()
	{
		if(!this.state.started)
		{
			this.setState({
				started:true
			})
		}
		this.timeStart = ()=>
		this.clocker = setInterval(()=>{
		let timer = this.state.workRest?this.state.w:this.state.r
		let changeClock = this.state.workRest?'work':'rest'
			if(timer)
			{
				this.setState({[changeClock.slice(0,1)]:timer-=1})
			}
			else
			{
				this.switchPomo()
				this.stopTimer()
				
			}
		},1000)

		if(!this.state.started&&this.state.w&&this.state.r)
		{
			this.timeStart()
		}	
		this.stopTimer=()=>{
			clearInterval(this.clocker)
			if(this.state.started&&(this.state.w||this.state.r))
			{
				this.timeStart()
			}
			else
			{
				this.stopPomo()
			}
		}
	}

	stopPomo()
	{
		let counterState;
		clearInterval(this.clocker)
		if(!this.state.w&&!this.state.r)
		{
			counterState = {
				started:false,
				r:this.state.rest,
				w:this.state.work
			}
		}
		else
		{
			counterState = {
				started:false
			}
		}
		this.setState(counterState)
	}

	removedPomo()
	{
		this.props.deletePomo(this.state.id)
	}

	addTime(props) 
	{
		let ws = props.slice(0,1)
		this.setState({
			[props]:this.state[props]+10,
			[ws]:this.state[ws]+10
		})
	}
	reduceTime(props) 
	{
		let ws = props.slice(0,1)
		this.setState({
			[props]:this.state[props]>9?this.state[props]-10:0,
			[ws]:this.state[ws]>9?this.state[ws]-10:0

		})
	}
  render()
  {
		let id = this.props.id
		let label = this.state.workRest?'Work':'Rest'
    let deleteButton = Buttn({secondary:true, text:'delete',click:this.removedPomo.bind(this)})
    let switchButton = Toggl({label:label,toggle:this.switchPomo,toggled:this.state.workRest, able: this.state.started})
		let startStop = !this.state.started
			?Buttn({text:'start',click:this.startPomo.bind(this)})
			:Buttn({text:'stop',click:this.stopPomo.bind(this)})
    return (
		<Row>
			<PomoContent clock={this.state} addTime={this.addTime.bind(this)} reduceTime={this.reduceTime.bind(this)}/>
			<Row 
				style={{paddingTop:10}}>
        <Col sm={4} md={4}>
          {deleteButton}
        </Col>
        <Col sm={4} md={4}>
          {startStop}
        </Col>
        <Col sm={4} md={4}
					style={{textAlign:'center'}}>
          {switchButton}
        </Col>	
			</Row>	
    </Row>)
  }
}

function Menu(props)
{
	let newButton = Buttn({text:'new',click:props.add.bind(this)})
	let style = {paddingTop:'10px',paddingBottom:'10px'}
  return (
	<Row style={style}>		
		<Col md={12}>
   		{newButton}
		</Col>
  </Row>)
}

function minsecs(data)
{
  let minutes = Math.floor(data/60);
  let secs = data%60
  let seconds = secs<10? '0'+secs: secs
  return minutes+':'+seconds
}

function newPomo(props)
{
  return {id:props,work:300,rest:300,started:false,w:300,r:300,repeat:false,workRest:true}
}

function deletePomo(props)
{
  let clocks = Object.assign([],[...this.state.clocks])
  .filter((a,b)=>{
    if(props !== a) return a
  })
  this.setState({
    clocks:clocks
	})
}

class App extends Component 
{
  constructor()
  {
    super()
    this.state=({
      clocks:[Math.random()*1000]
    })
		this.deletePomo = deletePomo.bind(this)
		this.addPomo = this.addPomo.bind(this)
		this.papr = papr.bind(this)
	}
	
  addPomo()
  { 
    let clocks = Object.assign([],[...this.state.clocks])
		clocks.push(Math.random()*1000)
    this.setState({
      clocks:clocks
		})
	}
	
  render() 
  {
		return (
		<Container fluid={true}>
      <Menu add={this.addPomo}/>
      <Row>
      {
				this.state.clocks.map(clock=>
				(
				<Col sm={6} md={4} key={clock} 
				style={{paddingBottom:'20px'}}>
				{
					this.papr({
						style:paperStyle,
						content:<Pomo 
						id={clock}
						deletePomo={this.deletePomo}/>
					})
				}
				</Col>
				)
      )}
      </Row>
    </Container>
		)
  }
}

export default App;
