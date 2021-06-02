// implement your posts router here
const express = require('express')

const router = express.Router()

const allPosts = require('./posts-model')
console.log('Posts MODEL ->', allPosts);

router.get('/', (req, res) => {
    allPosts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'Error retrieving the adopters'
    })
})
})

router.get('/:id', (req, res) => {
    allPosts.findById(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'Error retrieving the adopters'
    })
})
})

router.post('/', (req, res) => {
    const {title, contents} = req.body
    if (!title || !contents) {
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        allPosts.insert({title, contents})
        .then(({id}) => {
            return allPosts.findById(id)
        })
        .then(newCreated => {
            res.status(201).json(newCreated)
        })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "There was an error while saving the post to the database",
            error: error.message,
        });
      });
    }
})

// router.put('/:id', (req, res) => {
//     allPosts.update(req.params.id, req.params.changes)
//     .then(posts => {
//         if (!posts) {
//             res.status(404).json({ message: "The post with the specified ID does not exist" })
//         } else if (!req.body.title || !req.body.contents) {
//             res.status(400).json({message: "Please provide title and contents for the post"})
//         } else {
//             res.status()
//         }
//     })
//     .catch(error => {
//         console.log(error);
//         res.status(500).json({
//             message: "There was an error while saving the post to the database",
//             error: error.message,
//         });
//       });
// })

router.delete('/:id', (req, res) => {
    allPosts.remove(req.params.id)
      .then(deletedPost => {
        if (deletedPost) {
            const post = allPosts.findById(req.params.id)
            res.status(200).json(post)
        } else if (!deletedPost){
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: 'Error removing the adopter',
        });
      });
});

router.get('/:id/comments', (req, res) => {
    // 404 if not found & get all posts with id
    allPosts.findPostComments(req.params.id)
    .then(posts => {
        if (!posts) {
            res.status(404).json({ message: "The post with the specified ID does not exist"})
        } else {
            res.status(200).json(posts)
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'The comments information could not be retrieved'
    })
})
})

module.exports = router