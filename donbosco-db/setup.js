'use strict'

const debug = require('debug')('donbosco:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const minimist = require('minimist')
const db = require('.')

const args = minimist(process.argv)
const prompt = inquirer.createPromptModule()

async function setup () {
  if (!args.yes) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happened :)')
    }
  }

  const config = {
    database: process.env.DB_NAME || 'db_donbosco',
    username: process.env.DB_USER || 'dbuser',
    password: process.env.DB_PASS || 'dbpass',
    host: process.env.DB_HOST || '172.22.0.2',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
