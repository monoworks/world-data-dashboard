import { useQuery } from '@tanstack/react-query'
import { fetchAllCountries } from '@/services/restcountries'
import type { Country, CountrySearchItem } from '@/types/country'
import type { RestCountry } from '@/types/api'
import { useMemo } from 'react'

function normalizeCountry(rc: RestCountry): Country {
  return {
    iso2: rc.cca2,
    iso3: rc.cca3,
    name: rc.name.common,
    officialName: rc.name.official,
    flag: rc.flags.png,
    flagSvg: rc.flags.svg,
    region: rc.region || '',
    subregion: rc.subregion || '',
    population: rc.population,
    capitalCity: rc.capital?.[0] || '',
    lat: rc.latlng?.[0] || 0,
    lng: rc.latlng?.[1] || 0,
    currencies: {},
    languages: {},
    incomeLevel: '',
    borders: [],
  }
}

export function useCountries() {
  const query = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const restCountries = await fetchAllCountries()
      return restCountries.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name))
    },
    staleTime: Infinity,
  })

  const countryMap = useMemo(() => {
    const map = new Map<string, Country>()
    if (query.data) {
      for (const country of query.data) {
        map.set(country.iso3, country)
      }
    }
    return map
  }, [query.data])

  const searchItems = useMemo((): CountrySearchItem[] => {
    if (!query.data) return []
    return query.data.map((c) => ({
      iso3: c.iso3,
      iso2: c.iso2,
      name: c.name,
      flag: c.flag,
      region: c.region,
    }))
  }, [query.data])

  return {
    ...query,
    countryMap,
    searchItems,
  }
}

export function useCountrySearch(items: CountrySearchItem[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) return items.slice(0, 20)
    const q = searchQuery.toLowerCase()
    return items
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q) ||
          c.iso2.toLowerCase().includes(q)
      )
      .slice(0, 20)
  }, [items, searchQuery])
}
