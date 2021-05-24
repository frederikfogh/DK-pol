import json

from jinja2 import Environment, FileSystemLoader, select_autoescape

from constants import PARTIES, GENDERS, AGE_RANGES, REGIONS

env = Environment(
    loader=FileSystemLoader("../templates"),
    autoescape=select_autoescape()
)

with open("../data/parsed_data/general-data.json") as h_file:
    general_data = json.load(h_file)


def write_template(template, destination=None, **kwargs):

    if destination is None:
        destination = template

    content = env.get_template(f"{template}.html").render(
        last_updated=general_data["last-updated"],
        PARTIES=PARTIES,
        GENDERS=GENDERS,
        AGE_RANGES=AGE_RANGES,
        REGIONS=REGIONS,
        general_data=general_data,
        **kwargs,
    )

    destination_path = f"../index.html" if template == "index" else f"../pages/{destination}.html"

    with open(destination_path, 'w') as h_dest:
        h_dest.write(content)


write_template("index")
write_template("about")

for party in PARTIES:
    with open(f"../data/parsed_data/{party}.json") as h_file:
        party_data = json.load(h_file)

    write_template("party-statistics", f"{party.lower()}-statistics", party=party, party_data=party_data)
