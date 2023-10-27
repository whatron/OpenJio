import { Link, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import JWT from "../utils/JWT";

export default function EventPage() {
  // does a GET request, sets it in PostData variable

  const [event, setEvent] = useState({} as any);

  // to search for id based on url so we can GET request specific event
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");

  useEffect(() => {
    // Make the Axios GET request when the component mounts
    JWT.get(`http://localhost:8080/api/v1/events/id/${eventId}`)
      .then((response) => {
        setEvent(response.data); // Store the data in the "data" state variable
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

 
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex flex-col justify-center font-poppins">
      <NavBar />
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-xl p-8 shadow-2xl mx-auto border-4 border-gray-300 w-full max-w-2xl" key={event?.id}>
          
          <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-700 leading-tight">{event?.name}</h2>
          
          <div className="flex justify-center mb-10 relative group">
            <img
              src={event?.image}
              alt={event?.name}
              className="h-[400px] w-[300px] rounded-3xl shadow-lg transform transition-transform duration-300 group-hover:scale-105"
            />
           
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="p-6 bg-gray-100 rounded-lg text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="font-semibold text-xl mb-2">Date</div>
              {new Date(event?.startDateTime).toLocaleDateString()} to {new Date(event?.endDateTime).toLocaleDateString()}
            </div>
            <div className="p-6 bg-gray-100 rounded-lg text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="font-semibold text-xl mb-2">Time</div>
              {new Date(event?.startDateTime).toLocaleTimeString()} to {new Date(event?.endDateTime).toLocaleTimeString()}
            </div>
            <div className="p-6 bg-gray-100 rounded-lg text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="font-semibold text-xl mb-2">Venue</div>
              {event?.venue}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 mb-10 transform transition-transform duration-300 hover:scale-105">
            <div className="font-semibold text-2xl mb-4 text-center">Event Description</div>
            <div className="text-gray-700 text-center leading-relaxed">
              {event?.description}
            </div>
          </div>

          <div className="flex justify-center">
            <TicketFooter id={event?.id} />
          </div>
        </div>
      </div>
    </div>
  );

  
  function TicketFooter({ id }: { id: number }) {
    let body = {
        eventId: id,
    };

    const [showOrganiserAlert, setShowOrganiserAlert] = useState(false);

    async function handleClick() {
        console.log(body);

        await JWT.post("http://localhost:8080/api/v1/register-event", body).catch(
            (err) => {
                console.log(err.message);
            }
        );
    }

    function handleRegisterClick(e: React.MouseEvent) {
        const userType = localStorage.getItem("userType");
        if (userType === "ORGANISER") {
            setShowOrganiserAlert(true);
            e.preventDefault(); 
            e.stopPropagation();
            return;
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="hover:cursor-pointer font-ibm-plex-mono"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-ibm-plex-mono">
                            Confirm Registration?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Link to="/purchased" state={{ TID: id }}>
                            <Button
                                onClick={handleClick}
                                className="hover:cursor-pointer font-ibm-plex-mono"
                            >
                                Confirm
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {showOrganiserAlert && (
                <Dialog open={showOrganiserAlert}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-ibm-plex-mono">
                                Notification
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="font-ibm-plex-mono">
                            Organisers cannot register for events.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={() => setShowOrganiserAlert(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
}