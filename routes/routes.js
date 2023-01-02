const express = require('express');

const router = express.Router();

const {Group,User} = require ('../models/model');

router.post('/joinEvent/:id', async (req,res) => {
    try{
        const eventId = req.params.id;
        const user = await User.findById(req.user.id);
        let userGroup;
        // checking if user in the event
        if(user.event_id == eventId){
            res.status(400).json({message : "user already exist in the event"});
        }else{
            console.log("FIRST APPEARANCE OF THE USER!!")
            // checking if there are any groups in the event for user's current level
            const groupsOfEvent = await Group.find({$and: [{event_id : eventId}, {category: levelDecider(user.level)}]});

            //if there is no group for user's level or if there is no group in the event
            if(groupsOfEvent.length == 0){
                //create new group and update user group id column
                const newGroup = new Group({
                    event_id: eventId,
                    category: levelDecider(user.level),
                });

                userGroup = await newGroup.save();
                await User.findByIdAndUpdate({_id: user.id},{group_id: newGroup._id, event_id: eventId},{new: true}); 
            }
            //If there is more than 0 group
            if(groupsOfEvent.length > 0){
                for(let i = 0; i<groupsOfEvent.length; i++){
                    const usersInTheGroup = await User.find({group_id:groupsOfEvent[i]._id});

                    if(usersInTheGroup.length <= 20){
                        await User.findByIdAndUpdate({_id: user.id},{group_id: groupsOfEvent[i]._id, event_id: eventId},{new: true});
                        userGroup = groupsOfEvent[i];
                        break;
                    }else{
                        //create new group
                        const newGroup = new Group({
                            event_id: eventId,
                            category: levelDecider(user.level),
                        });

                        userGroup = await newGroup.save();
                        await User.findByIdAndUpdate({_id: user.id},{group_id: newGroup._id, event_id: eventId},{new: true}); 
                        break;
                    }
                }

            }
            // RETURN JOINED GROUP AND ITS USERS AS A RESPONSE
            const users = await User.find({group_id: userGroup._id},{group_id:0,event_id:0,username:0,password:0,level:0, __v:0});
            const responseData = {
                users: users,
                group: userGroup._id
            }
            res.send(responseData);
        }
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
});

const levelDecider = (level) => {
    if( typeof(level) != Number && level < 0){
        return -1
    }else {
        if(level < 20){
            return "Bronze"
        }
        else if (level >= 20 && level < 50){
            return "Silver";
        }
        else{
            return "Gold";
        }
    }
}

module.exports = router;