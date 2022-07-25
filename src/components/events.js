import React, { useEffect, useState } from "react";
import data from "../data/input.json";
const Events = () => {
  const [events, setEvents] = useState([]);

  const { height, width } = window.screen;
  // C'est le variable de temps entre 9 am et 9m
  const numberHours = 12;

  // On definit le numbre de minute pour 1 heure
  const minuteInHour = 60;
  // Pour cette variable on definit chaque minute egale a telle numbre de pixel
  // on devise le height de screen sur le numbre d'heure * 60 (minute on une heure)
  const minutePixel = Math.trunc(height / (numberHours * minuteInHour));
  useEffect(() => {
    data.sort((a, b) => new Date(a.start) - new Date(b.start));
    setEvents(data);
  }, [events]);

  // cette fonction permet de retouner l'heure et le minute pour chaque start d'event
  const getTime = time => {
    return {
      hours: time.split(":")[0],
      minute: time.split(":")[1]
    };
  };
  // cette fonction permet de retourner combien chaque event peut avoir de left de screen
  const getLeftPx = firstEvent => {
    return (width / minuteInHour) * getTime(firstEvent.start).minute;
  };
  // cette fonction permet de calculer le height de div
  // on  prend chaque pixel represente combien de minute et on multiple par la durée
  const getHeight = duration => {
    return `${Math.trunc(minutePixel * duration)}px`;
  };

  // cette fonction permet de recupere la position de l'element
  //  on multiple le numbre d'heure * 60 (minute pour chaque heure) et on ajoute les minutes aprés on multiple le tt * minutePixel
  const getPosition = startTime => {
    return `${Math.trunc(
      minutePixel *
        (getTime(startTime).hours * minuteInHour +
          parseInt(getTime(startTime).minute))
    )}px`;
  };
  // cette fonction retour le width de chaque event
  //1ere cas: si la durée de l'event actuel  inferieur a 60 on mis le width a 50px
  // 2eme cas : si l'event actuel et l'event suivant on le meme temps (heure et minute) on retourne le width a 50px
  // 3eme cas : si  les minute de l'event actuel inferieur au minute  de l'event suivant  on retourne le width a 50px
  // 4eme cas : si  les minute de l'event actuel superieur au minute  de l'event precedent  on retourne le width a 50px
  //  si non on retourne le width totale de screen
  const getWidth = index => {
    if (!(index >= events.length)) {
      const lastEvent = events[index - 1];
      const firstEvent = events[index];
      const secondEvent = events[index + 1];
      if (firstEvent.duration < minuteInHour) {
        return "50px";
      } else if (
        secondEvent &&
        getTime(firstEvent.start).hours === getTime(secondEvent.start).hours &&
        getTime(firstEvent.start).minute === getTime(secondEvent.start).minute
      ) {
        return "50px";
      } else if (
        !lastEvent &&
        getTime(firstEvent.start).hours === getTime(secondEvent.start).hours &&
        getTime(firstEvent.start).minute < getTime(secondEvent.start).minute
      ) {
        return "50px";
      } else if (
        lastEvent &&
        getTime(firstEvent.start).hours === getTime(lastEvent.start).hours &&
        getTime(firstEvent.start).minute > getTime(lastEvent.start).minute
      ) {
        return "50px";
      }
    }

    return width;
  };
  // cette fonction permet de retourne ou on positionne l'event horizontallement pour eviter l'overlapping des events
  // 1eme cas : si l'event precedent n'existe pas on retourne 0
  // 2eme cas : si l'event actuel et l'event suivant on le meme temps (heure et minute) on calcule l'event left et on ajoute 60px
  // 3eme cas : si  les minute de l'event actuel inferieur au minute  de l'event suivant  on retourne le left d'event
  // 4eme cas : si  les minute de l'event actuel superieur au minute  de l'event precedent  on retourne le left d'event
  // si non on retourne 0
  const getLeft = index => {
    if (!(index >= events.length)) {
      const lastEvent = events[index - 1];
      const firstEvent = events[index];
      const secondEvent = events[index + 1];

      if (!lastEvent) {
        return 0;
      } else if (
        getTime(firstEvent.start).hours === getTime(lastEvent.start).hours &&
        getTime(firstEvent.start).minute === getTime(lastEvent.start).minute
      ) {
        return getLeftPx(firstEvent) + 60;
      } else if (
        !lastEvent &&
        getTime(firstEvent.start).hours === getTime(secondEvent.start).hours &&
        getTime(firstEvent.start).minute < getTime(secondEvent.start).minute
      ) {
        return getLeftPx(firstEvent);
      } else if (
        getTime(firstEvent.start).hours === getTime(lastEvent.start).hours &&
        getTime(firstEvent.start).minute > getTime(lastEvent.start).minute
      ) {
        return getLeftPx(firstEvent);
      }

      return 0;
    }
  };
  return (
    <div>
      {events.map((event, index) => {
        return (
          <div
            style={{
              height: getHeight(event.duration),
              border: "1px",
              backgroundColor: "red",
              top: getPosition(event.start),
              position: "absolute",
              width: getWidth(index),
              left: getLeft(index)
            }}
          >
            <p>{event.id}</p>
          </div>
        );
      })}
    </div>
  );
};
export default Events;
