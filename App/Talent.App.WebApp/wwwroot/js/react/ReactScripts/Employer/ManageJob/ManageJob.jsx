import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Header, Modal, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Label, Button } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,

            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        // let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        //loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        // set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        loaderData.isLoading = false;

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');


        $.ajax({
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },

            url: link,
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + cookies,

            },
            success: function (data) {
                if (data.myJobs) {
                    this.state.loadJobs = data.myJobs
                }
                return callback();

            }.bind(this),

        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });

    }

    render() {
        let list = this.state.loadJobs;
        let datalist = null;


        if (list != "") {
            datalist = list.map(card =>
                <Card key={card.id}>

                    <Card.Content>
                        <Card.Header>{card.title}</Card.Header>
                        <Label color="black" ribbon="right"><i className="user icon"></i>0</Label>
                        <Card.Meta>
                            <span className='date'>{card.location.city}, {card.location.country}</span>
                        </Card.Meta>
                        <Card.Description>{card.summary}</Card.Description>
                    </Card.Content>
                    <Card.Content>
                        <span className="left floated">
                            {
                                <Label color='red'>Expired</Label>
                            }
                        </span>

                        <span className="right floated">
                            <Button.Group>
                                <Button className="ui blue basic"><i className="window close outline icon"></i>Close</Button>
                                <Button className="ui blue basic"><i className="edit icon"></i>Edit</Button>
                                <Button className="ui blue basic"><i className="copy icon"></i>Copy</Button>
                            </Button.Group>
                        </span>
                    </Card.Content>
                </Card>
            )
        }

        else {
            datalist = "No Jobs Found";
        }


        const filterOptions = [
            { key: 'showActive', text: 'showActive', value: 'showActive' },
            { key: 'showClosed', text: 'showClosed', value: 'showClosed' },
            { key: 'showDraft', text: 'showDraft', value: 'showDraft' },
            { key: 'showExpired', text: 'showExpired', value: 'showExpired' },
            { key: 'showUnexpired', text: 'showUnexpired', value: 'showUnexpired' }
        ]

        const sortOptions = [
            { key: 'Newest', text: 'Newest First', value: 'Newest' },
            { key: 'Oldest', text: 'Oldest First', value: 'Oldest' }
        ]
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">

                    <h2>List of Jobs</h2>
                    <div>
                        <span>
                            <i class="filter icon"></i>
                            Filter:

                <Dropdown placeholder="Choose filter" inline options={filterOptions} />
                        </span>
                        <span>
                            <i class="calendar alternate icon"></i>
                            Short by Date:
                      <Dropdown inline options={sortOptions} defaultValue={sortOptions[0].value} />
                        </span>
                        <br />
                    </div>
                    <br />
                    <div className="ui two cards">
                        {datalist}
                    </div>
                    <br />

                    <div align="center">
                        <Pagination
                            defaultActivePage={1}
                            totalPages={2}
                        />
                    </div>
                    <br />

                </div>
                <Modal open={this.state.open} size='small'>
                    <Modal.Content>
                        <Modal.Header> Are you sure you want to copy it!!! </Modal.Header>
                    </Modal.Content>
                    <Modal.Actions>

                        <button className="ui secondary button" onClick={this.close}>Cancel</button>
                        <button onClick={this.copy} className="ui green button" >Copy <i className="check icon"></i></button>
                    </Modal.Actions>
                </Modal>

            </BodyWrapper >
        )

    }
}