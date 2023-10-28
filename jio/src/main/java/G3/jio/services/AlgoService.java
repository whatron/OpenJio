package G3.jio.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import G3.jio.entities.Event;
import G3.jio.entities.EventRegistration;
import G3.jio.entities.Status;
import G3.jio.repositories.EventRegistrationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AlgoService {

    private final EventRegistrationRepository eventRegistrationRepository;

    public List<EventRegistration> allocateSlotsForEventWeightedRandom(Event event) {

        // get applications
        event.setAlgo("Weighted Random");
        List<EventRegistration> winners = new ArrayList<>();
        List<EventRegistration> applications = event.getRegistrations();

        // if applicants <= capacity, accept all
        if (applications.size() < event.getCapacity()) {
            return acceptAll(winners, applications);
        }

        // create pool add scores to respective idxs
        int[] pool = new int[applications.size()];
        for (int i = 0; i < applications.size() ; i++) {
            pool[i] = applications.get(i).getStudentScore();
        }

        // get winners
        Set<Integer> winnerIdx = new HashSet<>();
        for (int i = 0 ; i < event.getCapacity(); i++) {

            randPickOneWithWeight(winnerIdx, applications, pool);
        }
        
        // set winners to accepted and the rest of registrations to rejected and save
        for (int i = 0; i < applications.size(); i++) {
            
            EventRegistration er = applications.get(i);
            if (winnerIdx.contains(i)) {
                er.setStatus(Status.ACCEPTED);
                winners.add(er);

            } else {
                er.setStatus(Status.REJECTED);
            }

            // save
            eventRegistrationRepository.saveAndFlush(er);
        }

        return winners;
    }

    private void randPickOneWithWeight(Set<Integer> winnerIdx, List<EventRegistration> applications, int[] pool) {
        
        // get sum of scores
        int sumScore = 0;
        for (int i = 0; i < pool.length ; i++) {
            sumScore += pool[i];
        }

        // pick one random idx with weight
        Random rand = new Random();
        double randWeight = rand.nextDouble(sumScore);
        double cumScore = 0;

        // go thru pool
        for (int i = 0 ; i < pool.length; i++) {
            cumScore += pool[i];

            // if falls within cumulativeScore, add to set
            if (randWeight < cumScore) {
                winnerIdx.add(i);

                // remove from pool
                pool[i] = 0;
                
                // exit
                break;
            }
        }
    }

    public List<EventRegistration> allocateSlotsForEventRandom(Event event) {

        // get applications
        event.setAlgo("Random");
        List<EventRegistration> applications = event.getRegistrations();
        List<EventRegistration> winners = new ArrayList<>();
        
        // if applicants < capacity, accept all
        if (applications.size() <= event.getCapacity()) {
            return acceptAll(winners, applications);
        }

        // create pool
        List<Integer> pool = new ArrayList<>();
        for (int i = 0; i < applications.size(); i++) {
            pool.add(i, Integer.valueOf(i));
        }

        // System.out.println("pool: " + pool);

        // get winners, add to winners and exclude from future
        Set<Integer> winnerIdx = new HashSet<>();
        Random rand = new Random();
        for (int i = 0 ; i < event.getCapacity(); i++) {

            // pick a random index
            int idx = rand.nextInt(pool.size());
            // System.out.println("idx: " + idx);

            // add to winnerIdx
            winnerIdx.add(pool.get(idx));
  
            // remove from pool
            pool.remove(idx);

            // System.out.println(winnerIdx);
            // System.out.println(pool);
        }

        // set winners to accepted and the rest of registrations to rejected and save
        for (int i = 0; i < applications.size(); i++) {
            
            EventRegistration er = applications.get(i);
            if (winnerIdx.contains(i)) {
                // System.out.println("hello " + i);
                er.setStatus(Status.ACCEPTED);
                winners.add(er);

            } else {
                er.setStatus(Status.REJECTED);
            }

            // save
            eventRegistrationRepository.saveAndFlush(er);
        }

        return winners;
    }

    private List<EventRegistration> acceptAll(List<EventRegistration> winners, List<EventRegistration> applications) {

        Iterator<EventRegistration> iter = applications.iterator();
        while (iter.hasNext()) {
            EventRegistration er = iter.next();
            er.setStatus(Status.ACCEPTED);
            winners.add(er);

            // eventRegistrationRepository.saveAndFlush(er);
        }

        return winners;
    }

    // FCFS
    public List<EventRegistration> allocateSlotsForEventFCFS(Event event) {

        event.setAlgo("FCFS");
        List<EventRegistration> winners = new ArrayList<>();
        List<EventRegistration> applications = event.getRegistrations();
        applications.sort((o1, o2) -> {

                // compare by time
                if (!o1.getTime().equals(o2.getTime())) {
                    return o1.getTime().compareTo(o2.getTime());

                // compare by credit score
                } else {
                    return o1.getStudentScore() - o2.getStudentScore();
                }
            });


        for (int i = 0; i < applications.size(); i++) {

            EventRegistration registration = applications.get(i);

            if (i < event.getCapacity()) {
                registration.setStatus(Status.ACCEPTED);
                winners.add(registration);

            } else {
                registration.setStatus(Status.REJECTED);
            }

            eventRegistrationRepository.saveAndFlush(registration);
        }

        return winners;
    }
}
