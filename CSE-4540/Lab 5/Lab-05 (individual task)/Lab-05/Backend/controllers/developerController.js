const Developer = require('../models/developerModel')

// get all developers
const getDevelopers = async (req, res) => {
  const { specialization, available } = req.query
  let filter = {}

  if (specialization) {
    filter.specializations = specialization
  }
  if (available !== undefined) {
    filter.available = available === 'true'
  }

  const developers = await Developer.find(filter).sort({ createdAt: -1 })
  res.status(200).json(developers)
}

// get a single developer
const getDeveloper = async (req, res) => {
  const { id } = req.params

  const developer = await Developer.findById(id)

  if (!developer) {
    return res.status(404).json({ error: 'No such developer' })
  }

  res.status(200).json(developer)
}

// create a new developer
const createDeveloper = async (req, res) => {
  const { name, email, specializations, experienceYears, hourlyRate, available, certifications } = req.body

  try {
    const developer = await Developer.create({
      name,
      email,
      specializations,
      experienceYears,
      hourlyRate,
      available,
      certifications
    })
    res.status(200).json(developer)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a developer
const deleteDeveloper = async (req, res) => {
  const { id } = req.params

  const developer = await Developer.findOneAndDelete({ _id: id })

  if (!developer) {
    return res.status(400).json({ error: 'No such developer' })
  }

  res.status(200).json(developer)
}

// update a developer
const updateDeveloper = async (req, res) => {
  const { id } = req.params

  const developer = await Developer.findOneAndUpdate(
    { _id: id },
    { ...req.body }
  )

  if (!developer) {
    return res.status(400).json({ error: 'No such developer' })
  }

  res.status(200).json(developer)
}

module.exports = {
  getDevelopers,
  getDeveloper,
  createDeveloper,
  deleteDeveloper,
  updateDeveloper
}
