class M_user {
    // few datafields that use for matching
    constructor(id,genre,purpose,birth_day,ever_met =[]){
        this.id = id 
        this.genre = genre
        this.purpose = purpose
        this.birth_day = birth_day
        this.ever_met = ever_met
        //this.matching_state = matching_state
        // matching_state  can be three difference  =  {Idle , Matching,Matched}
        // Idle is not click on Random yet  and Matched is this user has already got couple
        // ever_met is list shown that user ever met somet users in this list

    }
}


module.exports =  M_user 
   