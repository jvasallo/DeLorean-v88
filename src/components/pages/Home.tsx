import * as React from 'react';
import { connect } from 'react-redux';

import Map from '../controls/Map';
import Button from '@material-ui/core/Button';
import RightArrow from '@material-ui/icons/KeyboardArrowRight';
import { EventbriteConfig } from '../../../config/delorean.config';

import { ApplicationState } from '../..';
import { getCurrentConfig } from '../../selectors/current';

import Logo from '../../assets/event-logo.svg';
import * as background from '../../assets/intro-background.jpg';
import { RouteComponentProps } from 'react-router';

import { isAfter, format } from 'date-fns';

import { DevfestDetails } from '../../../config/delorean.config';

type HomeProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class Home extends React.Component<HomeProps> {

    constructor(props: HomeProps, context: any) {
        super(props, context);

        window['EBWidgets'].createWidget({
            widgetType: 'checkout',
            eventId: EventbriteConfig.eventId,
            modal: true,
            modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
        });
    }

    openCalltoAction = () => window.open(this.props.config.event.papercall.url);

    buildVenueSection = () => {
        const { config } = this.props;

        if (!config || !config.venue) {
            return null;
        }

        return (
            <section className="venue">
                <Map theme={this.context.theme} />
            </section>
        );
    }

    buildPapercallSection = () => {
        const { config } = this.props;
        
        if (!config || !config.event || !config.event.papercall) {
            return null;
        }

        if (isAfter(new Date(), config.event.papercall.closing.toDate())) {
            return null;
        }

        return (
            <section className="call-to-action">
                <div className="container">
                    <h1 className="container-thin">
                        {`Interested in speaking at ${DevfestDetails.location} ${DevfestDetails.name}?`}
                    </h1>

                    <p>{`Consider submitting your talk by ${format(config.event.papercall.closing.toDate(), 'MMMM D, YYYY')}`}</p>

                    <div className="action">
                        <Button variant="fab" onClick={this.openCalltoAction}>
                            <RightArrow />
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        let { config } = this.props;

        return(
            <main>
                <section className="intro" style={{ backgroundImage: `url(${background})` }}>
                    <div className="container">
                        <Logo className="event-logo mb-4"/>

                        <h1 className="container-thin">
                            A community-run conference offering sessions, hack-a-thons, and codelabs accross many different technologies
                        </h1>

                        <h5 className="mb-2">Feb 01, 2019</h5>

                        <p>{config && config.venue ? config.venue.name : ''}</p>

                        <div className="mt-4">
                            <Button id={`get-event-tickets-${EventbriteConfig.eventId}`} variant="contained" color="secondary">
                                Get Tickets
                            </Button>
                        </div>
                    </div>
                </section>
                
                {this.buildPapercallSection()}
                {this.buildVenueSection()}
            </main>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);