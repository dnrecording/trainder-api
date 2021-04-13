class M_user {
    // few datafields that use for matching
    constructor(id,genre,purpose,birth_day){
        this.id = id 
        this.genre = genre
        this.purpose = purpose
        this.birth_day = birth_day
        //this.matching_state = matching_state
        // matching_state  can be three difference  =  {Idle , Matching,Matched}
        // Idle is not click on Random yet  and Matched is this user has already got couple

    }
}


module.exports =  M_user 
   