class Course {
    constructor(creator,genre,purpose){
        this.creator =creator
        this.genre = genre
        this.purpose = purpose 
        this.member = []
        

    }
}
class myEvent {
    constructor(id,name,creator,start,end,color,details){
     this.id = id
     this.name = name
     this.creator  =creator
     this.start = start
     this.end = end
     this.color = color 
     this.details = details

    }

}

module.exports = {Course ,myEvent}